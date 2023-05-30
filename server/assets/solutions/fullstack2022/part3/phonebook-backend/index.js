const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body',  (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res) => {
  Person.count().then(person_count => {
    const body = `
    <p>Phonebook has info for ${person_count} people</p>
    <p>${new Date()}</p
    `

    res.send(body)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
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

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new Person({
    name, number,
  })

  person.save()
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})