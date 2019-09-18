const express = require('express')
const cors = require('cors')
const routes = require('@util/routes')
const shibbolethCharsetMiddleware = require('@middleware/shibbolethCharsetMiddleware')
const currentUserMiddleware = require('@middleware/currentUserMiddleware')
const checkMiddleware = require('@middleware/checkMiddleware')
const errorMiddleware = require('@middleware/errorMiddleware')

const app = express()

app.use(cors())
app.use(express.json())
app.use(shibbolethCharsetMiddleware)
app.use(currentUserMiddleware)
app.use(checkMiddleware)

app.use(routes)

app.use(errorMiddleware)

module.exports = app
