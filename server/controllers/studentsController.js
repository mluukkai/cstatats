const { ApplicationError } = require('@util/customErrors')
const models = require('@db/models')

const submissions = async (req, res) => {
  const formatSubmissions = sub => ({
    week: sub.week,
    hours: sub.time,
    exercises: sub.exercises,
    course: sub.courseName ? sub.courseName : 'fullstack',
  })

  const user = await models.User
    .findOne({ student_number: req.params.student })
    .populate('submissions')

  res.send(user.submissions.map(formatSubmissions))
}

module.exports = {
  submissions,
}
