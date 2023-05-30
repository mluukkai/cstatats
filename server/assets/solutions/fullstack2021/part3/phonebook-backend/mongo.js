require('dotenv').config()
const Person = require('./models/person')

if (process.argv.length < 5) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(({ name, number }) => {
      console.log(`${name} ${number}`)
    })
  })
} else {
  const name = process.argv[3]
  const number = process.argv[4]
  const note = new Person({ name, number })
  
  note.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
  })
}

