const { ApplicationError } = require('@util/customErrors')
const { ADMINS, QUESTIONS, formProject } = require('@util/common')
const models = require('@db/models')

const create = async (req, res) => {
  const { username } = req.currentUser

  let user = await models.User
    .findOne({ username })
    .exec()

  const course = req.params.courseName

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
}

const weekly = async (req, res) => {
  const week = Number(req.params.week)
  const { username } = req.currentUser

  if (username !== 'mluukkai') throw new ApplicationError('Not authorized', 400)

  const { courseName } = req.params
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

module.exports = {
  create,
  weekly,
}
