const mongoose = require('mongoose')
require('dotenv').config()

const Person = require('./models/person')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if ( process.argv.length<4) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  const name = process.argv[2]
  const number = process.argv[3]
  const person = new Person({
    name,
    number,
  })
  person.save(() => {
    console.log(`added ${name}, number ${number} to phonebook`)
    mongoose.connection.close()
  })
}