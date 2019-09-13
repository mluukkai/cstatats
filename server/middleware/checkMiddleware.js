const jwt = require('jsonwebtoken')

const { TOKEN_SECRET } = require('@util/common')
const models = require('@db/models')

const check = async (req, res, next) => {
  try {
    if (req.path.includes('/solutions/')) {
      const endOfPath = req.path.substring(11)
      const part = Number(endOfPath.substring(endOfPath.indexOf('/') + 5)[0])

      const token = req.headers['x-access-token'] || req.query.token
      const { username } = jwt.verify(token, TOKEN_SECRET)

      const user = await models
        .User
        .findOne({ username })
        .populate('submissions')
        .exec()

      const completedParts = user.submissions.map(s => s.week)

      const courseName = endOfPath.substring(0, endOfPath.indexOf('/'))

      const course = await models.Course
        .findOne({ name: courseName })
        .exec()

      if (!completedParts.includes(part) && course.week <= part) {
        return res.status(401).json({ error: 'not authorized' })
      }
    }
  } catch (e) {
    console.log(e)
    next()
  }

  next()
}

module.exports = check
