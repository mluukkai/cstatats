const jwt = require('jsonwebtoken')
const { isAdmin, isShibboleth, JWT_SECRET } = require('@util/common')
const models = require('@db/models')

const getUsernameFromShibboleth = (req) => {
  const { uid } = req.headers
  return uid
}

const getUsernameFromGithub = (req) => {
  const token = req.headers['x-access-token']
  if (!token) return undefined

  const { username } = jwt.verify(token, JWT_SECRET)
  return username
}

const currentUser = async (req, res, next) => {
  let username = isShibboleth ? getUsernameFromShibboleth(req) : getUsernameFromGithub(req)
  if (!username) return res.send({})

  if (isAdmin(username)) {
    const loggedInAs = req.headers['x-admin-logged-in-as']
    if (loggedInAs) username = loggedInAs
  }

  req.currentUser = username && await models.User.findOne({ username }).exec()

  next()
}

module.exports = currentUser
