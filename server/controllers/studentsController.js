const { ApplicationError } = require('@util/customErrors')
const { isAdmin, getQuizScoreInPart } = require('@util/common')
const models = require('@db/models')

const userInCourse = (user, courseName) => (
  (user.submissions && user.submissions.length && user.submissions.find(s => s.courseName === courseName))
  || (user.quizAnswers && user.quizAnswers[courseName])
  || (user.extensions && user.extensions.length)
)

const getAllForCourse = async (req, res) => {
  const { courseName } = req.params

  const formatUser = (u) => {
    const submissionsForThisCourse = u.submissions.filter(s => s.courseName === courseName)
    return {
      ...u.toJSON(),
      submissions: submissionsForThisCourse,
      total_exercises: submissionsForThisCourse.reduce((sum, s) => sum + s.exercises.length, 0),
      project: {
        id: u.project ? u.project._id : undefined,
        accepted: u.projectAccepted,
        name: u.project ? u.project.name : undefined,
      },
    }
  }

  const byName = (a, b) => a.name.localeCompare(b.name)
  const users = await models.User.find({}).populate('submissions').populate('project')

  const students = users
    .filter(u => userInCourse(u, courseName))
    .map(formatUser).sort(byName)
  res.send(students)
}

const getAllForCourseInWeek = async (req, res) => {
  const week = Number(req.params.week)
  const { username } = req.currentUser
  const { courseName } = req.params

  if (!isAdmin(username, courseName)) throw new ApplicationError('Not authorized', 403)

  const all = await models.Submission.find({ week, courseName }).populate('user').exec()

  const format = s => ({
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
  const { studentNumber, courseName } = req.params
  const formatSubmissions = sub => ({
    week: sub.week,
    hours: sub.time,
    exercises: sub.exercises,
    course: sub.courseName,
  })

  const student = await models.User.findOne({ student_number: studentNumber }).populate('submissions').exec()

  res.send({
    studentNumber,
    submissions: student.submissions.map(formatSubmissions).filter(a => a.course === courseName),
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
    const found = vc[week].map(e => exercises.includes(e))
    return !found.includes(false)
  }

  const missingVc = (week, exercises) => {
    const notFound = vc[week].filter(e => !exercises.includes(e))
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

    scoring.totalScore = parts.reduce((acc, cur) => acc + scoring[cur].points, 0)
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
      submissions: u.submissions.filter(s => s.courseName === courseName).map(formatSubmission),
      total_exercises: u.submissions.reduce((sum, s) => sum + s.exercises.length, 0),
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

  const users = await models
    .User
    .find({})
    .populate('submissions')
    .populate('project')
    .exec()

  const response = users
    .filter(u => userInCourse(u, courseName))
    .map(formatUser)
    .sort(byName)

  res.send(response)
}

module.exports = {
  getOne,
  getAllForCourse,
  getAllForCourseInWeek,
  exportCourseResults,
}
