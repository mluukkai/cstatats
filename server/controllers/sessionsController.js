const { ApplicationError } = require('@util/customErrors')

// Creating session is simply returning user to user
const create = async (req, res) => {
  const { currentUser } = req
  if (!currentUser) throw new ApplicationError('Forbidden', 403)

  return res.send(currentUser)
}

const destroy = async (req, res) => {
  const logoutUrl = req.headers.shib_logout_url
  const { returnUrl } = req.body
  console.log(returnUrl, logoutUrl)
  if (!logoutUrl) return res.send({ logoutUrl: returnUrl })

  return res.send({ logoutUrl: `${logoutUrl}?return=${returnUrl}` })
}

module.exports = {
  create,
  destroy,
}
