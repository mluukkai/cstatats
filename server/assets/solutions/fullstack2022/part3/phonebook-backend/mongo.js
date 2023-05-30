require('dotenv').config()
const mongoose = require('mongoose')

const Person = require('./models/person')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length===4 ) {
  Person.findOne({ name: process.argv[3] }).then(person => {
    if ( person ) {
      console.log(`number: ${person.number}`)
    } else {
      console.log('not found')
    }
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}