const { ApplicationError } = require('@util/customErrors')
const models = require('@db/models')

const deleteUser = async (uid) => {
  try {
    await models.User.findOneAndRemove({ username: uid })
  } catch (_) { /* Don't care */ }
}

const currentUser = async (req, res, next) => {
  console.log('Headers:', req.headers)
  const {
    givenname: givenName = null, // First name
    mail = null, // Email
    schacpersonaluniquecode: schacPersonalUniqueCode = null, // contains student number
    sn = null, // Last name
    uid = null,
  } = req.headers

  if (!uid) throw new ApplicationError('Forbidden', 403)
  await deleteUser(uid)

  const studentNumber = schacPersonalUniqueCode ? schacPersonalUniqueCode.split(':')[6] : null

  req.currentUser = await models.User.findOne({ username: uid })

  if (req.currentUser) return next()

  const newUser = models.User({
    username: uid,
    hy_email: mail,
    first_names: givenName,
    last_name: sn,
    admin: false || !!(uid === 'admin'),
    student_number: studentNumber,
  })

  req.currentUser = await newUser.save()

  next()
}

module.exports = currentUser
