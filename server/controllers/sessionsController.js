const { ApplicationError } = require('@util/customErrors')

const destroy = async (req, res) => {
  const logoutUrl = req.headers.shib_logout_url
  const { returnUrl } = req.body
  console.log(returnUrl, logoutUrl)
  if (!logoutUrl) return res.send({ logoutUrl: returnUrl })

  return res.send({ logoutUrl: `${logoutUrl}?return=${returnUrl}` })
}

module.exports = {
  destroy,
}
