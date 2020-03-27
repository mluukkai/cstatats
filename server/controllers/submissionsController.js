const { ApplicationError, UserInputError } = require('@util/customErrors')
const { isAdmin } = require('@util/common')
const models = require('@db/models')

const create = async (req, res) => {
  const { username } = req.currentUser
  const { courseName } = req.params

  const user = await models.User.findOne({ username })
  const courseInfo = await models.Course.findOne({ name: courseName })

  if (!courseInfo) throw new ApplicationError('Course not found', 404)

  const coursePartCount = courseInfo.exercises ? courseInfo.exercises.length : 0
  const week = req.body.week !== undefined ? req.body.week : courseInfo.week

  if (week >= coursePartCount) {
    throw new UserInputError(`Course does not have a part ${week}, the last part is ${coursePartCount - 1}`)
  }
  
  user.ensureRandom(courseName)

  const sub = new models.Submission({
    week,
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
  if (!user.submissions) user.submissions = []

  user.submissions.push(sub._id)
  await user.save()

  await user.populate('submissions').execPopulate()

  res.send(user)
}

const weekly = async (req, res) => {
  const week = Number(req.params.week)
  const { username } = req.currentUser
  const { courseName } = req.params

  if (!isAdmin(username, courseName)) throw new ApplicationError('Not authorized', 403)

  const all = await models.Submission.find({ week, courseName }).populate('user').exec()

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

const getCourseWeek = async (req, res) => {
  const { courseName, username, week } = req.params

  const user = await models
    .User
    .findOne({ username })
    .populate({
      path: 'submissions',
      match: { week, courseName },
    }).exec()

  const submission = user.submissions[0]

  res.send(submission || {})
}

const updateCourseWeek = async (req, res) => {
  const { courseName, username, week } = req.params

  const { time, exercises, github, comment } = req.body

  const user = await models
    .User
    .findOne({ username })

  const oldSubmission = await models
    .Submission
    .findOne({ user: user._id, courseName, week })

  const sub = new models.Submission({
    week,
    exercises,
    time,
    github,
    user: user._id,
    comment,
    username: user.username,
    courseName,
  })

  await sub.save()

  if (oldSubmission) {
    user.submissions = user.submissions.filter(s => !s.equals(oldSubmission._id))
    oldSubmission.delete()
  }
  user.submissions.push(sub._id)
  await user.save()

  res.send(200)
}

const deleteOne = async (req, res) => {
  const { courseName, username, week } = req.params

  const user = await models
    .User
    .findOne({ username })

  const oldSubmission = await models
    .Submission
    .findOne({ user: user._id, courseName, week })

  if (!oldSubmission) return res.send(404)

  user.submissions = user.submissions.filter(s => !s.equals(oldSubmission._id))
  await oldSubmission.delete()
  await user.save()

  res.send(200)
}

module.exports = {
  create,
  weekly,
  getCourseWeek,
  updateCourseWeek,
  deleteOne,
}
