const jwt = require('jsonwebtoken')
const models = require('@db/models')
const { isShibboleth, JWT_SECRET } = require('@util/common')

const createUserFromShibbolethData = (headers) => {
  const {
    uid,
    givenname, // First name
    mail, // Email
    schacpersonaluniquecode, // contains student number
    sn, // Last name
  } = headers

  const studentNumber = schacpersonaluniquecode ? schacpersonaluniquecode.split(':')[6] : null

  const newUser = models.User({
    username: uid,
    hy_email: mail,
    first_names: givenname,
    last_name: sn,
    admin: false || !!(uid === 'admin'),
    student_number: studentNumber,
  })

  return newUser.save()
}

const shibbolethRegister = async (req, res, next) => {
  const username = req.headers.uid
  const user = username && await models.User.findOne({ username })
  if (user) return next()

  await createUserFromShibbolethData(req.headers)

  next()
}

const createUserFromGithubData = (decodedToken) => {
  const { username, name, email } = decodedToken

  const newUser = models.User({
    username,
    email,
    name,
  })

  return newUser.save()
}

const githubRegister = async (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) return next()

  const decoded = jwt.verify(token, JWT_SECRET)
  const { username } = decoded
  const user = username && await models.User.findOne({ username })
  if (user) return next()

  await createUserFromGithubData(decoded)

  next()
}

const registerUser = async (req, res, next) => {
  if (isShibboleth) return shibbolethRegister(req, res, next)
  try {
    await githubRegister(req, res, next)
  } catch (err) {
    next()
  }
}

module.exports = registerUser
