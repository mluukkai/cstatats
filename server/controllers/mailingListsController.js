const models = require('@db/models')

const getForCourse = async (req, res) => {
  const { course } = req.params

  const courseSubmissions = await models.Submission.find(
    { courseName: course },
    { user: 1 },
  )
    .distinct('user')
    .populate({
      path: 'user',
      match: {
        $or: [
          { newsletterSubscription: true },
          { newsletterSubscription: { $exists: false } },
        ],
      },
    })

  const emails = courseSubmissions
    .map(({ user }) => (user ? user.email : null))
    .filter(Boolean)

  res.send(emails)
}

module.exports = {
  getForCourse,
}
