const { ApplicationError } = require('@util/customErrors')

// Creating session is simply returning user to user
const create = async (req, res) => {
  const { currentUser } = req
  if (!currentUser) throw new ApplicationError('Forbidden', 403)

  return res.send(currentUser)
}

module.exports = {
  create,
}
