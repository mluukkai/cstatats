const express = require('express')
const cors = require('cors')
const routes = require('@util/routes')
const shibbolethCharsetMiddleware = require('unfuck-utf8-headers-middleware')
const registerUserMiddleware = require('@middleware/registerUserMiddleware')
const currentUserMiddleware = require('@middleware/currentUserMiddleware')
const checkMiddleware = require('@middleware/checkMiddleware')
const errorMiddleware = require('@middleware/errorMiddleware')

const app = express()

const shibbolethHeaders = [
  'uid',
  'givenname', // First name
  'mail', // Email
  'schacpersonaluniquecode', // Contains student number
  'sn', // Last name
]

app.use(cors())
app.use(express.json())
app.use(registerUserMiddleware)
app.use(shibbolethCharsetMiddleware(shibbolethHeaders))
app.use(currentUserMiddleware)
app.use(checkMiddleware)

app.use(routes)

app.use(errorMiddleware)

module.exports = app
