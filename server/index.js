const mustacheExpress = require('mustache-express')
const express = require('express')
const path = require('path')
const cors = require('cors')
const routes = require('@util/routes')
const shibbolethCharsetMiddleware = require('unfuck-utf8-headers-middleware')
const errorMiddleware = require('@middleware/errorMiddleware')
const { SHIBBOLETH_HEADERS } = require('@util/common')

const app = express()

app.use(cors())
app.use(express.json())
app.use(shibbolethCharsetMiddleware(SHIBBOLETH_HEADERS))

app.engine('html', mustacheExpress())
app.set('view engine', 'html')
app.set('views', path.join(__dirname, '/certificates'))
app.use('/admin/certificate', express.static('certificates'))
app.use(routes)

app.use(errorMiddleware)

module.exports = app
