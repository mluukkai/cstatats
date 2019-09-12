const mongoose = require('mongoose')
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/ohtustats'
mongoose.connect(mongoUrl, { useMongoClient: true })
mongoose.Promise = global.Promise

console.log("USING mongo", mongoUrl)

const Submission = mongoose.model('StatsSubmission', {
  week: Number,
  exercises: [Number],
  comment: String,
  time: Number,
  github: String,
  username: String,
  courseName: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsCourse' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsUser' }
})

const Extension = mongoose.model('StatsExtension', {
  extensionFrom: String,
  github: String,
  username: String,
  courseName: String,
  extendsWith: Object,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsCourse' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsUser' }
})

const Project = mongoose.model('StatsProject', {
  name: String,
  github: String,
  meeting: String,
  instructor: String,
  courseName: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsCourse' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StatsUser' }]
})

const User = mongoose.model('StatsUser', { 
  username: String,
  student_number: String,
  token: String,
  admin: Boolean,
  first_names: String,
  last_name: String,
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StatsSubmission' }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsProject' },
  projectAccepted: Boolean,
  peerReview: Object,
  extensions: Object
})

const Course = mongoose.model('StatsCourse', { 
  fullName: String,
  name: String,
  term: String,
  year: Number,
  week: Number,
  exercises: [Number],
  enabled: Boolean,
  url: String,
  miniproject: Boolean,
  extension: Boolean
})

module.exports = {
  User,
  Submission,
  Course,
  Project,
  Extension,
  mongoose
}