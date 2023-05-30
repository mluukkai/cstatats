const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req) => { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const page = `Phnebook has info for ${persons.length} people<br>${new Date()}`
    res.send(page)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  const person = new Person({ name, number })

  person
    .save().then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const person = {
    name, number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})