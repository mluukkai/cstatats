const { ApplicationError } = require('@util/customErrors')
const models = require('@db/models')

const currentUser = async (req, res, next) => {
  const { uid } = req.headers
  if (!uid) throw new ApplicationError('User is not logged in', 403)

  req.currentUser = await models.User.findOne({ username: uid }).exec()

  if (!req.currentUser) throw new ApplicationError('User not in database', 403)

  next()
}

module.exports = currentUser
