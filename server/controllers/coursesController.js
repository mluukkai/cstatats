const jwt = require('jsonwebtoken')

const { ApplicationError } = require('@util/customErrors')
const { ADMINS, QUESTIONS, TOKEN_SECRET, formProject } = require('@util/common')
const models = require('@db/models')

const getAll = async (req, res) => {
  const courses = await models
    .Course
    .find({})

  res.send(courses)
}

const info = async (req, res) => {
  const course = await models.Course
    .findOne({ name: req.params.course })
    .exec()

  if (course) {
    res.send(course)
  } else {
    res.status(400).end()
  }
}

const extensionstats = async (req, res) => {
  const notByAdmin = s => !['mluukkai', 'testertester'].includes(s.username)

  const { course } = req.params

  const allStudents = await models.User.find()

  const noAdmins = allStudents.filter(notByAdmin)

  const allExtensions = _.flatten(noAdmins
    .filter(s => s.extensions)
    .map(s => s.extensions))

  const extensions = _.flatten(allExtensions.filter(e => e.to === course)
    .map(e => e.extendsWith))

  const partlyExtensions = _.groupBy(extensions, e => e.part)

  console.log(partlyExtensions)

  const stats = Object.keys(partlyExtensions).reduce((acc, cur) => {
    acc[cur] = partlyExtensions[cur].length
    return acc
  }, {})

  res.send(stats)
}

const stats = async (req, res) => {
  const notByAdmin = s => !['mluukkai', 'testertester'].includes(s.username)

  const all = await models.Submission.find()
  const stats = all.filter(s => s.courseName === req.params.course).filter(notByAdmin).reduce((acc, cur) => {
    const { week } = cur
    if (acc[week] === undefined) {
      acc[week] = {
        students: 0,
        hour_total: 0,
        exercise_total: 0,
        hours: [],
        exercises: [],
      }
    }

    const { time } = cur
    const exercise_count = cur.exercises.length

    if (acc[week].hours[time] === undefined) {
      acc[week].hours[time] = 0
    }
    if (acc[week].exercises[exercise_count] === undefined) {
      acc[week].exercises[exercise_count] = 0
    }

    acc[week].students += 1
    acc[week].hour_total += time
    acc[week].exercise_total += exercise_count
    acc[week].hours[time] += 1
    acc[week].exercises[exercise_count] += exercise_count

    return acc
  }, {})

  res.send(stats)
}

const solutionFiles = async (req, res) => {
  try {
    const isDir = name => fs.lstatSync(name).isDirectory()

    const { course } = req.params

    const fs = require('fs')
    const solutionFolder = `public/solutions/${course}/part${req.params.part}`

    const recurse = (folder) => {
      const files = []

      fs.readdirSync(folder).forEach((name) => {
        const fullName = `${folder}/${name}`
        const type = isDir(fullName) ? 'dir' : 'file'
        const fileObject = { name, type, fullName: fullName.substring(7) }
        if (isDir(fullName)) {
          fileObject.files = recurse(fullName)
        }

        files.push(fileObject)
      })

      return files
    }

    const files = recurse(solutionFolder)

    res.send(files)
  } catch (e) {
    console.log(e)
  }
}

const projects = async (req, res) => {
  const githubUser = (u) => {
    if (u.submissions.length === 0) {
      return 'not defined'
    }

    const last = u.submissions[u.submissions.length - 1]
    const repo = last.github.substring(19)
    const end = repo.indexOf('/')
    return repo.substring(0, end)
  }

  try {
    const token = req.headers['x-access-token'] || req.query.token
    const { username } = jwt.verify(token, TOKEN_SECRET)

    if (!ADMINS.includes(username)) {
      res.status(400).json({ error: 'not authorized' })
    }
  } catch (e) {
    res.status(400).json({ error: e })
  }

  const courseName = req.params.course

  const projects = await models
    .Project
    .find({ courseName })
    .populate('users')

  const users = await models
    .User
    .find()
    .populate('submissions')

  const userToGithub = {}
  users.forEach((u) => {
    userToGithub[u._id] = githubUser(u)
  })

  const formProjectWithGithubToUsers = (p) => {
    const peerReviewsFrom = (users, questions) => {
      const reviews = []

      questions.forEach((q) => {
        const question = {
          title: q.title,
          type: q.type,
          answers: {},
        }

        if (q.type === 'rating') {
          users.forEach((target) => {
            question.answers[target.username] = []
            users.forEach((u) => {
              if (u.peerReview) {
                const score = { by: u.username }
                score.score = u.peerReview[q.id][target.username]
                question.answers[target.username].push(score)
              }
            })
          })
        } else {
          users.forEach((u) => {
            if (u.peerReview) {
              question.answers[u.username] = u.peerReview[q.id]
            }
          })
        }

        reviews.push(question)
      })

      return reviews
    }

    const formUser = u => ({
      last_name: u.last_name,
      first_names: u.first_names,
      username: u.username,
      github: userToGithub[u._id],
      peerReview: u.peerReview,
    })

    if (p === null) {
      return null
    }

    let peerReviews = null
    try {
      peerReviews = peerReviewsFrom(p.users, questions)
    } catch (e) {
      console.log(e)
    }

    const answers = Object.values(Object.values(peerReviews)[0].answers)

    const peerReviewsGiven = answers.length > 0 ? answers[0].length : 0

    if (peerReviewsGiven === 0) {
      peerReviews = []
    }

    return {
      name: p.name,
      github: p.github,
      _id: p._id,
      meeting: p.meeting,
      instructor: p.instructor,
      users: p.users.map(formUser),
      peerReviews,
      peerReviewsGiven,
    }
  }

  res.send(projects.map(formProjectWithGithubToUsers))
}

const projectRepositories = async (req, res) => {
  const courseName = req.params.course

  const projects = await models
    .Project
    .find({ courseName })

  const random = () => 0.5 - Math.random()

  res.send(projects.sort(random).map(p => p.github))
}

const questions = async (req, res) => {
  res.send(QUESTIONS)
}

const createProject = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    const { username } = jwt.verify(token, TOKEN_SECRET)

    const course = req.params.course

    const courseInfo = await models.Course.findOne({ name: course })

    const name = req.body.form_name
    const old = await models.Project.findOne({ name, courseName: course })
    if (old !== null) {
      res.status(400).send({ error: 'miniproject name must be unique' })
    } else {
      const user = await models.User.findOne({ username })

      const project = new models.Project({
        name,
        github: req.body.form_repository,
        users: [user._id],
        courseName: course,
        course: courseInfo,
      })

      await project.save()
      user.project = project._id
      await user.save()

      const createdProject = await models
        .Project
        .findById(project.id)
        .populate('users')
        .exec()

      res.send(formProject(createdProject))
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({ error: 'something went wrong...' })
  }
}

const createSubmission = async function (req, res) {
  try {
    const token = req.headers['x-access-token']
    const { username } = jwt.verify(token, TOKEN_SECRET)

    let user = await models.User
      .findOne({ username })
      .exec()

    const course = req.params.course

    const courseInfo = await models.Course.findOne({ name: course })

    const sub = new models.Submission({
      week: req.body.week !== undefined ? req.body.week : courseInfo.week,
      exercises: req.body.exercises,
      user: user._id,
      time: req.body.hours,
      comment: req.body.comments,
      github: req.body.github,
      username,
      course: courseInfo._id,
      courseName: courseInfo.name,
    })

    await sub.save()

    user.submissions.push(sub._id)
    await user.save()

    user = await models
      .User
      .findOne({ username })
      .populate('submissions')
      .exec()

    res.send(user)
  } catch (e) {
    console.log(e)
    res.status(500).send({ error: 'something went wrong...' })
  }
}

const students = async (req, res) => {
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

  try {
    const token = req.headers['x-access-token'] || req.query.token
    const form_token = jwt.verify(token, TOKEN_SECRET)
    const course = req.params.course

    if (form_token.username !== 'mluukkai') {
      res.status(500).send({ error: 'operation not permitted' })
      return
    }

    const formatUser = (u) => {
      const formatSubmission = (s) => {
        const resp = {
          week: s.week,
          exercises: s.exercises.length,
          time: s.time,
        }

        if (req.query.vc) {
          resp.vc = checkVc(s.week, s.exercises),
          resp.missing = missingVc(s.week, s.exercises)
        }

        if (s.comment.lenght > 0) {
          resp.comment = s.comment
        }

        return resp
      }

      const resp = {
        student_number: u.student_number,
        first_names: u.first_names,
        last_name: u.last_name,
        username: u.username,
        submissions: u.submissions.filter(s => s.courseName === course).map(formatSubmission),
        total_exercises: u.submissions.reduce((sum, s) => sum + s.exercises.length, 0),
        extensions: u.extensions,
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

    const byLastName = (a, b) => {
      if (a.last_name < b.last_name) {
        return -1
      }
      if (a.last_name > b.last_name) {
        return 1
      }

      return a.first_names < b.first_names ? -1 : 1
    }


    const users = await models
      .User
      .find({})
      .populate('submissions')
      .populate('project')
      .exec()

    res.send(users.filter(u => u.submissions.length > 0 || (u.extensions && u.extensions.length > 0)).map(formatUser).sort(byLastName))
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: 'operation not permitted' })
  }
}

const weeklySubmissions = async (req, res) => {
  const week = Number(req.params.week)
  try {
    const token = req.query.token
    const { username } = jwt.verify(token, TOKEN_SECRET)

    if (username !== 'mluukkai') {
      res.status(400).json({ error: 'not authorized' })
    }
  } catch (e) {
    res.status(400).json({ error: e })
  }
  const courseName = req.params.course
  const all = await models.Submission.find({ week, courseName })
    .populate('user')
    .exec()

  const format = s => ({
    student: {
      username: s.user.username,
      student_number: s.user.student_number,
      first_names: s.user.first_names,
      last_name: s.user.last_name,
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

const userExtensions = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    const { username } = jwt.verify(token, TOKEN_SECRET)

    let user = await models.User
      .findOne({ username })
      .exec()

    const course = req.params.course

    const courseInfo = await models.Course.findOne({ name: course })

    const body = req.body

    console.log(body)

    let extendsWith
    let fromFs
    let userToMatch

    if (body.from === 'fullstackopen2018') {
      console.log('open')
      fromFs = require('./data/fsopen.json')
      userToMatch = body.github
    } else if (body.from === 'fullstack2018') {
      console.log('HY ')
      fromFs = require('./data/fsk18.json')
      userToMatch = username
    } else {
      wtf
    }

    const submissions = fromFs
      .find(s => s.username === userToMatch)
      .submissions
      .filter(s => s.week <= Number(body.to))

    extendsWith = submissions.map(s => ({
      part: s.week,
      exercises: s.exercise_count || s.exercises,
    }))

    const ext = new models.Extension({
      extensionFrom: body.from,
      extendsWith,
      github: req.body.github,
      username,
      user: user._id,
      course: courseInfo._id,
      courseName: courseInfo.name,
    })

    await ext.save()

    if (!user.extensions) {
      user.extensions = []
    }

    const extensions = user.extensions.concat({
      from: body.from,
      to: courseInfo.name,
      extendsWith,
    })

    user.extensions = null
    await user.save()

    user.extensions = extensions

    await user.save()

    console.log(user)

    user = await models
      .User
      .findOne({ username })
      .populate('submissions')
      .exec()

    res.send(user)
  } catch (e) {
    console.log(e)
    res.status(500).send({ error: 'something went wrong...' })
  }
}

module.exports = {
  getAll,
  info,
  extensionstats,
  stats,
  solutionFiles,
  projects,
  projectRepositories,
  questions,
  createProject,
  createSubmission,
  students,
  weeklySubmissions,
  userExtensions,
}
