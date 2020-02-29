const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: String,
  github: String,
  meeting: String,
  instructor: String,
  courseName: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsCourse' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StatsUser' }],
})

const formUser = u => ({
  name: u.name || `${u.first_names || ''} ${u.last_name || ''}`,
  username: u.username,
})

projectSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.users = returnedObject.users.map(formUser)

    const fields = [
      'id', 'name', 'github', 'meeting',
      'instructor', 'courseName', 'course', 'users',
    ]
    Object.keys(returnedObject).forEach((key) => {
      if (fields.includes(key)) return
      delete returnedObject[key]
    })
  },
})

module.exports = projectSchema
