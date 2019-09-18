const models = require('@db/models')

const registerUser = async (req, res, next) => {
  const { uid } = req.headers

  const user = await models.User.findOne({ username: uid })
  if (user) return next()

  const {
    givenname, // First name
    mail, // Email
    schacpersonaluniquecode, // contains student number
    sn, // Last name
  } = req.headers

  const studentNumber = schacpersonaluniquecode ? schacpersonaluniquecode.split(':')[6] : null

  const newUser = models.User({
    username: uid,
    hy_email: mail,
    first_names: givenname,
    last_name: sn,
    admin: false || !!(uid === 'admin'),
    student_number: studentNumber,
  })

  req.currentUser = await newUser.save()

  next()
}

module.exports = registerUser
