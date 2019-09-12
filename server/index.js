const express = require('express')
const cors = require('cors')
const routes = require('@util/routes')
const errorMiddleware = require('@middleware/errorMiddleware')
const checkMiddleware = require('@middleware/checkMiddleware')

const app = express()

app.use(cors())
app.use(express.json())
app.use(checkMiddleware)

app.use(routes)

app.use(errorMiddleware)

module.exports = app
