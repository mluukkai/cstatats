const { ApplicationError } = require('@util/customErrors')
const { isAdmin } = require('@util/common')
const models = require('@db/models')

const currentUser = async (req, res, next) => {
  let { uid } = req.headers
  if (!uid) throw new ApplicationError('User is not logged in', 403)

  if (isAdmin(uid)) {
    const loggedInAs = req.headers['x-admin-logged-in-as']
    if (loggedInAs) uid = loggedInAs
  }

  req.currentUser = await models.User.findOne({ username: uid }).exec()

  if (!req.currentUser) throw new ApplicationError('User not in database', 403)

  next()
}

module.exports = currentUser
