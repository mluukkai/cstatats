const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.static('build'))

app.use(cors())
app.use(express.json())
morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

require('dotenv').config()
const Person = require('./models/person')

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const html = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    response.send(html)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = { name, number } 

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ 
      error: 'name and number must be present' 
    })
  }

  const person = new Person({ name, number })
  
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})