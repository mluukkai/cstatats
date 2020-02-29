const simpleOauthModule = require('simple-oauth2')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { GITHUB, JWT_SECRET } = require('@util/common')

const oauth2 = simpleOauthModule.create({
  client: {
    id: GITHUB.id,
    secret: GITHUB.secret,
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize',
  },
})

const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: GITHUB.callback,
  state: GITHUB.state,
})

const githubLogin = async (req, res) => {
  res.redirect(authorizationUri)
}

const githubCallback = async (req, res) => {
  const { code } = req.query
  try {
    const result = await oauth2.authorizationCode.getToken({ code })
    const { token } = oauth2.accessToken.create(result)

    return res.redirect(`${GITHUB.redirect}?token=${token.access_token}`)
  } catch (error) {
    console.error('Access Token Error', error.message)
    return res.json('Authentication failed')
  }
}

const getToken = async (req, res) => {
  const { token } = req.query

  const { data } = await axios.get('https://api.github.com/user', {
    headers: { Authorization: `token ${token}` },
  })

  const jwtToken = jwt.sign({
    username: data.login,
    name: data.name,
    email: data.email,
  }, JWT_SECRET)

  res.send({ token: jwtToken })
}

const destroy = async (req, res) => {
  const logoutUrl = req.headers.shib_logout_url
  const { returnUrl } = req.body
  if (!logoutUrl) return res.send({ logoutUrl: returnUrl })

  return res.send({ logoutUrl: `${logoutUrl}?return=${returnUrl}` })
}

module.exports = {
  githubLogin,
  githubCallback,
  destroy,
  getToken,
}
