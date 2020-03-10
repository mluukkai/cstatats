const Sentry = require('@sentry/node')

const { inProduction } = require('@util/common')

const configureSentry = () => {
  if (!inProduction) return [(req, res, next) => { next() }, (req, res, next) => { next() }]

  Sentry.init({
    dsn: 'https://9da76962fae04a1d95df8900e295420a:c1e2f4b9c86c4e3297c9f8796700164a@toska.cs.helsinki.fi/14',
  })

  return [Sentry.Handlers.requestHandler(), Sentry.Handlers.errorHandler()]
}

module.exports = configureSentry
