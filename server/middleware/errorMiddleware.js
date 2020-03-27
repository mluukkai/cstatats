const { ApplicationError } = require('../util/customErrors')

const errorHandler = (error, req, res, next) => {
  console.error(error.message, error.name, error.extra)

  const normalizedError =
    error instanceof ApplicationError
      ? error
      : new ApplicationError(error.message)

  res.status(normalizedError.status).json(normalizedError)

  return next(error)
}

module.exports = errorHandler
