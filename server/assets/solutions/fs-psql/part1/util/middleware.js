const jwt = require('jsonwebtoken')

const { User, Session } = require('../models')
const { SECRET } = require('../util/config')

const errorHandler = (error, req, res, next) => {
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).send({
      error: error.errors.map(e => e.message)
    })
  }

  if (error.name === 'SequelizeDatabaseError') {
    console.log(error)
    return res.status(400).send({
      error: 'bad data...'
    })
  }

  next(error)
}

const sessionFrom = async (token) => {
  return await Session.findOne({
    where: {
      token
    },
    include: {
      model: User
    }
  })
}

const userFromToken = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' })
  }

  const session = await sessionFrom(authorization.substring(7))

  if (!session) {
    return res.status(401).json({ error: 'no valid session' })
  }

  if (session.user.disabled) {
    return res.status(401).json({ error: 'account disabled' })
  }

  req.user = session.user
  
  next()
}

module.exports = {
  errorHandler,
  userFromToken
}

