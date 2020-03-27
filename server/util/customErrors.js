class ApplicationError extends Error {
  constructor(message, status, extra) {
    super()

    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name

    this.message = message || 'Something went wrong. Please try again.'

    this.status = status || 500

    this.extra = extra || {}
  }

  toJSON() {
    return {
      error: this.message,
    }
  }
}

class UserInputError extends ApplicationError {
  constructor(message, extra) {
    super(message || 'Invalid user input', 400, extra)
  }
}

class NotFoundError extends ApplicationError {
  constructor(message, extra) {
    super(message || 'Resource is not found', 404, extra)
  }
}

module.exports = {
  ApplicationError,
  UserInputError,
  NotFoundError,
}
