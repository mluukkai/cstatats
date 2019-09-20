const { ApplicationError } = require('@util/customErrors')
const { ADMINS, QUESTIONS } = require('@util/common')
const models = require('@db/models')

const getAll = async (req, res) => {
  const courses = await models.Course.find({})

  res.send(courses)
}

const info = async (req, res) => {
  const course = await models.Course
    .findOne({ name: req.params.courseName })
    .exec()

  if (!course) throw new ApplicationError('Course not found', 404)

  res.send(course)
}

const stats = async (req, res) => {
  const notByAdmin = s => !['mluukkai', 'testertester'].includes(s.username)

  const all = await models.Submission.find()
  const stats = all.filter(s => s.courseName === req.params.courseName).filter(notByAdmin).reduce((acc, cur) => {
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

    const course = req.params.courseName

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

  if (!ADMINS.includes(req.currentUser.username)) throw new ApplicationError('Not authorized', 403)

  const { courseName } = req.params

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
  const { courseName } = req.params

  const projects = await models
    .Project
    .find({ courseName })

  const random = () => 0.5 - Math.random()

  res.send(projects.sort(random).map(p => p.github))
}

const questions = async (req, res) => {
  res.send(QUESTIONS)
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

  if (req.currentUser.username !== 'mluukkai') throw new ApplicationError('Not authorized', 403)
  const course = req.params.courseName

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
}

const create = async (req, res) => {
  const {
    name, url, term, year, exercises, enabled,
  } = req.body

  const newCourse = models.Course({
    name,
    url,
    exercises,
    week: 1,
    enabled,
    term,
    year,
  })

  const course = await newCourse.save()
  res.send(course)
}

const update = async (req, res) => {
  const { courseName } = req.params
  const course = await models.Course.findOne({ name: courseName })

  Object.keys(req.body).forEach((key) => {
    course[key] = req.body[key]
  })
  await course.save()

  res.send(course)
}

module.exports = {
  getAll,
  info,
  stats,
  solutionFiles,
  projects,
  projectRepositories,
  questions,
  students,
  create,
  update,
}
