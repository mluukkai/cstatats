const PEER_REVIEW_QUESTIONS = require('@assets/peer_review_questions')
const { ApplicationError } = require('@util/customErrors')
const { isAdmin } = require('@util/common')
const models = require('@db/models')

const getAll = async (req, res) => {
  const courses = await models.Course.find({})

  console.log('***')

  res.send(courses)
}

const info = async (req, res) => {
  const course = await models.Course.findOne({ name: req.params.courseName })

  if (!course) throw new ApplicationError('Course not found', 404)

  const response = {
    week: course.week,
    enrolmentCheckData: course.enrolmentCheckData,
    exercises: course.exercises,
    enabled: course.enabled,
    miniproject: course.miniproject,
    peerReviewOpen: course.peerReviewOpen,
    extension: course.extension,
    year: course.year,
    term: course.term,
    fullName: course.fullName,
    name: course.name,
    url: course.url,
    _id: course._id, // eslint-disable-line no-underscore-dangle
  }

  res.send(response)
}

const getCurrentStats = async (courseName) => {
  const byAdmin = (submission) => isAdmin(submission.username, courseName)

  const all = await models.Submission.find({ courseName }).sort({ time: 1 })
  const allMappedToWeeks = all.reduce((acc, cur) => {
    if (byAdmin(cur)) return acc
    if (!acc[cur.week]) acc[cur.week] = []
    acc[cur.week].push(cur)
    return acc
  }, {})

  const stats = Object.keys(allMappedToWeeks).reduce((acc, cur) => {
    const submissions = allMappedToWeeks[cur]
    const middleTime =
      (submissions[Math.floor(submissions.length / 2)] || {}).time || 0
    const cutoff = 5 + middleTime * 3 // Magic numbers
    if (!acc[cur]) {
      acc[cur] = {
        students: 0,
        hour_total: 0,
        exercise_total: 0,
        hours: [],
      }
    }
    submissions.forEach((sub) => {
      let { time } = sub
      const { exercises } = sub
      if (time > cutoff) time = cutoff // This cuts off trolls

      if (!acc[cur].hours[time]) {
        acc[cur].hours[time] = 0
      }
      acc[cur].students += 1
      acc[cur].hour_total += Math.ceil(time)
      acc[cur].exercise_total += exercises.length
      acc[cur].hours[time] += 1
    })
    return acc
  }, {})

  return stats
}

const generateStats = async (req, res) => {
  const { courseName } = req.params

  const stats = await getCurrentStats(courseName)

  await models.Statistic.deleteMany({ name: courseName })

  const statsObject = new models.Statistic({
    name: courseName,
    stats,
    time: new Date(),
  })

  await statsObject.save()

  res.send({
    status: 'done',
  })
}

const stats = async (req, res) => {
  const { courseName } = req.params

  const statObject = await models.Statistic.findOne(
    { name: courseName },
    null,
    { sort: { time: -1 } },
  )

  const limit = new Date()
  limit.setMinutes(limit.getMinutes() - 60)

  if (statObject && new Date(statObject.time) > limit) {
    return res.send(statObject.stats)
  }

  const stats = await getCurrentStats(courseName)

  await models.Statistic.deleteMany({ name: courseName })

  const statsObject = new models.Statistic({
    name: courseName,
    stats,
    time: new Date(),
  })

  await statsObject.save()

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

  const projects = await models.Project.find({ courseName })
    .populate('users')
    .exec()

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

    const formUser = (u) => {
      const formattedUser = u.toJSON()

      return {
        name: formattedUser.name,
        username: u.username,
        github: userToGithub[u._id],
        peerReview: u.peerReview,
      }
    }

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
      id: p._id,
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

  const projects = await models.Project.find({ courseName })

  const random = () => 0.5 - Math.random()

  res.send(projects.sort(random).map((p) => p.github))
}

const create = async (req, res) => {
  const permittedFields = [
    'name',
    'enrolmentCheckData',
    'url',
    'term',
    'year',
    'fullName',
    'exercises',
    'enabled',
    'miniproject',
    'peerReviewOpen',
    'extension',
  ]

  console.log('--->', permittedFields)

  const courseFields = permittedFields.reduce(
    (acc, field) => ({
      ...acc,
      [field]: req.body[field],
    }),
    {},
  )

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
  generateStats,
  projects,
  projectRepositories,
  create,
  update,
}
