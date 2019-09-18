const { ApplicationError } = require('@util/customErrors')
const models = require('@db/models')

const currentUser = async (req, res, next) => {
  const { uid } = req.headers

  req.currentUser = await models.User.findOne({ username: uid })

  if (!req.currentUser) throw new ApplicationError('User not in database', 403)

  next()
}

module.exports = currentUser
