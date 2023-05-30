const mongoose = require('mongoose')

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  favoriteGenre: String,
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', schema)

module.exports = User
