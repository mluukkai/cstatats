/* eslint-disable no-await-in-loop */
const { ApplicationError } = require('@util/customErrors')
const { isAdmin, getQuizScoreInPart } = require('@util/common')
const models = require('@db/models')

const userInCourse = (user, courseName) =>
  (user.submissions &&
    user.submissions.length &&
    user.submissions.find((s) => s.courseName === courseName)) ||
  (user.quizAnswers && user.quizAnswers[courseName]) ||
  (user.extensions &&
    user.extensions.length &&
    user.extensions.find(
      (e) => e.courseName === courseName || e.to === courseName,
    ))

const getAllForCourse = async (req, res) => {
  const { courseName } = req.params

  const formatUser = (u) => {
    const user = u.toJSON()
    const submissionsForThisCourse = user.submissions.filter(
      (s) => s.courseName === courseName,
    )
    return {
      ...user,
      email: u.email || u.hy_email,
      submissions: submissionsForThisCourse,
      total_exercises: submissionsForThisCourse.reduce(
        (sum, s) => sum + s.exercises.length,
        0,
      ),
      project: {
        id: u.project ? u.project._id : undefined,
        accepted: u.projectAccepted,
        name: u.project ? u.project.name : undefined,
      },
    }
  }

  const submissionUserIds = await models.Submission.find({
    courseName,
  }).distinct('user')

  const users = await models.User.find({
    $or: [
      { _id: { $in: submissionUserIds } },
      { [`quizAnswers.${courseName}`]: { $exists: true } },
      {
        extensions: { $elemMatch: { courseName } },
      },
      {
        extensions: { $elemMatch: { to: courseName } },
      },
    ],
  })
    .sort({ name: 1 })
    .populate('submissions')
    .populate('project')

  const students = users.map(formatUser)

  res.send(students)
}

const getAllForCourseNoQuizz = async (req, res) => {
  const { courseName } = req.params

  const formatUser = (u) => {
    const user = u.toJSON()
    const submissionsForThisCourse = user.submissions.filter(
      (s) => s.courseName === courseName,
    )
    return {
      ...user,
      email: u.email || u.hy_email,
      submissions: submissionsForThisCourse,
      total_exercises: submissionsForThisCourse.reduce(
        (sum, s) => sum + s.exercises.length,
        0,
      ),
      quizAnswers: null,
    }
  }

  const submissionUserIds = await models.Submission.find({
    courseName,
  }).distinct('user')

  const users = await models.User.find({
    $or: [
      { _id: { $in: submissionUserIds } },
      { [`quizAnswers.${courseName}`]: { $exists: true } },
      {
        extensions: { $elemMatch: { courseName } },
      },
      {
        extensions: { $elemMatch: { to: courseName } },
      },
    ],
  })
    .sort({ name: 1 })
    .populate('submissions')
    .populate('project')

  const students = users.map(formatUser)

  res.send(students)
}

const getAllForCourseSimple = async (req, res) => {
  const users = await models.User.find({})
  res.send(users)
}

const getCompletedForCourse = async (req, res) => {
  const { courseName } = req.params
  const users = await models.User.find({
    courseProgress: {
      $elemMatch: {
        courseName,
        completed: { $nin: [null, false] },
      },
    },
  })
    .populate('submissions')
    .exec()
  const formatted = users.map((u) => {
    const jsoned = u.toJSON()
    return {
      ...jsoned,
      submissions: jsoned.submissions.filter(
        (s) => s.courseName === courseName,
      ),
    }
  })
  res.send(formatted)
}

const getCompletedCountForCourse = async (req, res) => {
  const { courseName } = req.params
  const users = await models.User.find({
    courseProgress: {
      $elemMatch: {
        courseName,
        completed: { $nin: [null, false] },
      },
    },
  })
    .populate('submissions')
    .exec()

  const filtered = users
    .map((u) => {
      const jsoned = u.toJSON()
      return {
        ...jsoned,
        submissions: null,
        access: null,
      }
    })
    .map((s) => {
      return {
        ...s,
        courseProgress: s.courseProgress.find(
          (p) => p.courseName === courseName,
        ),
      }
    })
    .filter((s) => s.courseProgress.suotarReady && !s.courseProgress.oodi)

  res.send({ count: filtered.length })
}

const getAllForCourseInWeek = async (req, res) => {
  const week = Number(req.params.week)
  const { username } = req.currentUser
  const { courseName } = req.params

  if (!isAdmin(username, courseName))
    throw new ApplicationError('Not authorized', 403)

  const all = await models.Submission.find({ week, courseName })
    .populate('user')
    .exec()

  const format = (s) => ({
    student: {
      username: s.user.username,
      student_number: s.user.student_number,
      name: s.user.name,
    },
    hours: s.time,
    exercise_count: s.exercises.length,
    marked: s.exercises,
    github: s.github,
    comment: s.comment,
  })

  const formattedSubmissions = all.map(format)

  res.send(formattedSubmissions)
}

const getOne = async (req, res) => {
  const { username, courseName } = req.params
  const formatSubmissions = (sub) => ({
    week: sub.week,
    hours: sub.time,
    exercises: sub.exercises,
    course: sub.courseName,
  })

  const student = await models.User.findOne({ username })
    .populate('submissions')
    .exec()

  res.send({
    username,
    student_number: student.student_number,
    submissions: student.submissions
      .map(formatSubmissions)
      .filter((a) => a.course === courseName),
    quizAnswers: (student.quizAnswers || {})[courseName],
  })
}

const exportCourseResults = async (req, res) => {
  const { courseName } = req.params
  const vc = {
    1: [2, 3, 4, 5, 6, 17],
    2: [4, 5, 6, 7, 8],
    3: [],
    4: [1, 7, 8],
    5: [3, 4, 5, 6],
    6: [],
    7: [],
  }

  const checkVc = (week, exercises) => {
    const found = vc[week].map((e) => exercises.includes(e))
    return !found.includes(false)
  }

  const missingVc = (week, exercises) => {
    const notFound = vc[week].filter((e) => !exercises.includes(e))
    return notFound
  }

  const quizScoreForCourse = (quizAnswers = {}, courseName) => {
    const course = quizAnswers[courseName] || {}

    const scoring = {}
    const parts = Object.keys(course)
    parts.forEach((part) => {
      const answers = course[part].answers || []
      scoring[part] = getQuizScoreInPart(answers, courseName, part)
    })

    scoring.totalScore = parts.reduce(
      (acc, cur) => acc + scoring[cur].points,
      0,
    )
    return scoring
  }

  const formatUser = (u) => {
    const formatSubmission = (s) => {
      const resp = {
        week: s.week,
        exercises: s.exercises.length,
        exercise_set: s.exercises,
        time: s.time,
      }

      if (req.query.vc) {
        resp.vc = checkVc(s.week, s.exercises)
        resp.missing = missingVc(s.week, s.exercises)
      }

      if (s.comment.lenght > 0) {
        resp.comment = s.comment
      }

      return resp
    }
    const userJSON = u.toJSON()
    const resp = {
      ...userJSON,
      submissions: u.submissions
        .filter((s) => s.courseName === courseName)
        .map(formatSubmission),
      total_exercises: u.submissions.reduce(
        (sum, s) => sum + s.exercises.length,
        0,
      ),
      quizzes: quizScoreForCourse(u.quizAnswers, courseName),
      project: {},
    }

    if (u.projectAccepted) {
      resp.project.accepted = true
    }
    if (u.project) {
      resp.project.name = u.project.name
    }

    return resp
  }

  const byName = (a, b) => a.name.localeCompare(b.name)

  const users = await models.User.find({})
    .populate('submissions')
    .populate('project')
    .exec()

  const response = users
    .filter((u) => userInCourse(u, courseName))
    .map(formatUser)
    .sort(byName)

  res.send(response)
}

const completionUpdate = async (req, res) => {
  const { username, courseName } = req.params
  console.log('JEEEE', username, courseName)

  const user = await models.User.findOne({ username }).exec()
  const progress = user.getProgressForCourse(courseName)

  console.log(progress)

  const newProgress = {
    ...progress,
    completed: undefined,
  }

  console.log(newProgress)

  user.updateCourseProgress(newProgress)
  await user.save()

  res.send({ data: 'yes'})
}

const updateProgress = async (req, res) => {
  const { username } = req.params
  const { courseName, creditsParts0to7, oodi } = req.body

  delete req.body.creditsParts0to7

  if (!username || !courseName)
    throw new ApplicationError(
      'Malformed payload - no courseName or no username in params',
      400,
    )

  const user = await models.User.findOne({ username }).exec()
  const progress = user.getProgressForCourse(courseName)

  const newProgress = {
    ...progress,
    ...req.body,
  }

  // update the credits in oodi (all but graphql and typescript...)
  if (oodi && creditsParts0to7) {
    if (!newProgress.grading) {
      newProgress.grading = {
        exam1: {
          done: newProgress.exam1,
        },
        exam2: {
          done: newProgress.exam2,
        },
        credits: creditsParts0to7,
      }
    }
    newProgress.grading.credits = creditsParts0to7
  }

  user.updateCourseProgress(newProgress)
  await user.save()
  res.send(user)
}

const updateStudentsProgress = async (req, res) => {
  const students = req.body

  for (let i = 0; i < students.length; i++) {
    const { student, updated } = students[i]

    const { suotarReady, oodi, creditsParts0to7 } = updated
    const updateObject = {}
    if (suotarReady !== undefined) {
      updateObject.suotarReady = suotarReady
    }
    if (oodi !== undefined) {
      updateObject.oodi = oodi
    }

    const user = await models.User.findOne({ username: student }).exec()
    const progress = user.getProgressForCourse(updated.courseName)
    const newProgress = {
      ...progress,
      ...updateObject,
    }

    if (oodi && creditsParts0to7) {
      if (!newProgress.grading) {
        newProgress.grading = {
          exam1: {
            done: newProgress.exam1,
          },
          exam2: {
            done: newProgress.exam2,
          },
          credits: creditsParts0to7,
        }
      }
      newProgress.grading.credits = creditsParts0to7
    }

    user.updateCourseProgress(newProgress)

    await user.save()
  }

  res.send({})
}

module.exports = {
  getOne,
  getAllForCourse,
  getCompletedForCourse,
  getCompletedCountForCourse,
  getAllForCourseInWeek,
  updateProgress,
  exportCourseResults,
  getAllForCourseSimple,
  updateStudentsProgress,
  getAllForCourseNoQuizz,
  completionUpdate
}
