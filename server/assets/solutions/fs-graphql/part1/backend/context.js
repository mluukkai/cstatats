const User = require('./models/user')

const jwt = require('jsonwebtoken')

const context = async ({ req, res }) => {
  const auth = req ? req.headers.authorization : null
  if (auth && auth.startsWith('Bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), process.env.JWT_SECRET
    )
    const currentUser = await User
      .findById(decodedToken.id)
    return { currentUser }
  }
}

module.exports = context