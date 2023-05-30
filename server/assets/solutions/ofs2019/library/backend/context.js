const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const User = require('./models/user')

const context = async ({ req }) => {
  const auth = req ? req.headers.authorization : null
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
    const currentUser = await User.findById(decodedToken.id)
    return { currentUser }
  }
}

module.exports = context
