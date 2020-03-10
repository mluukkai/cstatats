const Sentry = require('@sentry/node')

const { inProduction } = require('@util/common')

const configureSentry = () => {
  if (!inProduction) return [(req, res, next) => { next() }, (req, res, next) => { next() }]

  Sentry.init({
    dsn: 'https://9da76962fae04a1d95df8900e295420a@toska.cs.helsinki.fi/14',
  })

  return [Sentry.Handlers.requestHandler(), Sentry.Handlers.errorHandler()]
}

module.exports = configureSentry
