const PEER_REVIEW_QUESTIONS = require('@assets/peer_review_questions')
const { ApplicationError } = require('@util/customErrors')
const { isAdmin } = require('@util/common')
const models = require('@db/models')

const getAll = async (req, res) => {
  const courses = await models.Course.find({})

  res.send(courses)
}

const info = async (req, res) => {
  const course = await models.Course
    .findOne({ name: req.params.courseName })

  if (!course) throw new ApplicationError('Course not found', 404)

  res.send(course)
}

const stats = async (req, res) => {
  const { courseName } = req.params
  const notByAdmin = submission => !isAdmin(submission.username, courseName)

  const all = await models.Submission.find()
  const stats = all.filter(s => s.courseName === courseName).filter(notByAdmin).reduce((acc, cur) => {
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

const projects = async (req, res) => {
  const { courseName } = req.params

  const githubUser = (u) => {
    if (u.submissions.length === 0) {
      return 'not defined'
    }

    const last = u.submissions[u.submissions.length - 1]
    const repo = last.github.substring(19)
    const end = repo.indexOf('/')
    return repo.substring(0, end)
  }

  const projects = await models.Project.find({ courseName }).populate('users').exec()

  const users = await models.User.find().populate('submissions').exec()

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
      name: u.name,
      username: u.username,
      github: userToGithub[u._id],
      peerReview: u.peerReview,
    })

    if (p === null) {
      return null
    }

    let peerReviews = null
    try {
      peerReviews = peerReviewsFrom(p.users, PEER_REVIEW_QUESTIONS)
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

const create = async (req, res) => {
  const permittedFields = ['name', 'url', 'term', 'year', 'fullName',
    'exercises', 'enabled', 'miniproject', 'peerReviewOpen', 'extension']

  const courseFields = permittedFields.reduce((acc, field) => ({
    ...acc,
    [field]: req.body[field],
  }), {})

  const newCourse = models.Course(courseFields)

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
  projects,
  projectRepositories,
  create,
  update,
}
