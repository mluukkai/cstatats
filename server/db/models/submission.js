const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
  week: Number,
  exercises: [Number],
  comment: String,
  time: Number,
  github: String,
  username: String,
  courseName: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsCourse' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsUser' },
})

submissionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const fields = [
      'week', 'exercises', 'time', 'comment',
      'github', 'username', 'courseName', 'course', 'user', 'id', '_id'
    ]
    Object.keys(returnedObject).forEach((key) => {
      if (fields.includes(key)) return
      delete returnedObject[key]
    })
  },
})


module.exports = submissionSchema
