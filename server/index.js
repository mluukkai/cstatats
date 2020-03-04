const express = require('express')
const cors = require('cors')
const routes = require('@util/routes')
const shibbolethCharsetMiddleware = require('unfuck-utf8-headers-middleware')
const errorMiddleware = require('@middleware/errorMiddleware')
const { SHIBBOLETH_HEADERS } = require('@util/common')

const app = express()

app.use(cors())
app.use(express.json())
app.use(shibbolethCharsetMiddleware(SHIBBOLETH_HEADERS))

app.use(routes)

app.use(errorMiddleware)

module.exports = app
