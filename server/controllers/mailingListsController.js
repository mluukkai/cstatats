const models = require('@db/models')

const getForCourse = async (req, res) => {
  const { course } = req.params

  const usersInCourse = await models.Submission.find({
    courseName: course,
  }).distinct('user')

  const users = await models.User.find({
    _id: { $in: usersInCourse },
    email: { $exists: true },
    $or: [
      { newsletterSubscription: true },
      { newsletterSubscription: { $exists: false } },
    ],
  })

  const emails = users.map(({ email }) => email).filter(Boolean)

  res.send(emails)
}

module.exports = {
  getForCourse,
}
