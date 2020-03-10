const express = require('express')
const cors = require('cors')
const routes = require('@util/routes')
const shibbolethCharsetMiddleware = require('unfuck-utf8-headers-middleware')
const errorMiddleware = require('@middleware/errorMiddleware')
const { SHIBBOLETH_HEADERS } = require('@util/common')
const configureSentry = require('@util/sentry')

const [requestHandler, errorHandler] = configureSentry()
const app = express()

app.use(requestHandler)
app.use(cors())
app.use(express.json())
app.use(shibbolethCharsetMiddleware(SHIBBOLETH_HEADERS))

app.use(routes)

app.use(errorHandler)
app.use(errorMiddleware)

module.exports = app
