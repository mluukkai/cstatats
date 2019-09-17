const { ApplicationError } = require('@util/customErrors')
const models = require('@db/models')

const currentUser = async (req, res, next) => {
  const {
    givenname: givenName = null, // First name
    mail = null, // Email
    schacpersonaluniquecode: schacPersonalUniqueCode = null, // contains student number
    sn = null, // Last name
    uid = null,
  } = req.headers

  if (!uid) throw new ApplicationError('Forbidden', 403)

  const studentNumber = schacPersonalUniqueCode ? schacPersonalUniqueCode.split(':')[6] : null

  req.currentUser = await models.User.findOne({ username: uid })

  if (req.currentUser) return next()

  const newUser = models.User({
    username: uid,
    hy_email: mail,
    first_names: Buffer.from(givenName, 'binary').toString('utf8'),
    last_name: Buffer.from(sn, 'binary').toString('utf8'),
    admin: false || !!(uid === 'admin'),
    student_number: studentNumber,
  })

  req.currentUser = await newUser.save()

  next()
}

module.exports = currentUser
