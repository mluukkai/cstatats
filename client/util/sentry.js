import * as Sentry from '@sentry/browser'
import { inProduction } from 'Utilities/common'

const configureSentry = () => {
  if (!inProduction) return

  Sentry.init({
    dsn: 'https://9da76962fae04a1d95df8900e295420a@toska.cs.helsinki.fi/14',
  })
}

export default configureSentry
