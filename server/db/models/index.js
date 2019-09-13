const mongoose = require('mongoose')
const { MONGO_URL } = require('@util/common')

mongoose.connect(MONGO_URL)
mongoose.Promise = global.Promise

console.log('USING mongo', MONGO_URL)

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

const extensionSchema = new mongoose.Schema({
  extensionFrom: String,
  github: String,
  username: String,
  courseName: String,
  extendsWith: Object,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsCourse' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsUser' },
})

const projectSchema = new mongoose.Schema({
  name: String,
  github: String,
  meeting: String,
  instructor: String,
  courseName: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsCourse' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StatsUser' }],
})

const userSchema = new mongoose.Schema({
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
  extensions: Object,
})

const courseSchema = new mongoose.Schema({
  fullName: String,
  name: String,
  term: String,
  year: Number,
  week: Number,
  exercises: [Number],
  enabled: Boolean,
  url: String,
  miniproject: Boolean,
  extension: Boolean,
})

let models
try {
  models = {
    User: mongoose.model('StatsUser', userSchema),
    Submission: mongoose.model('StatsSubmission', submissionSchema),
    Course: mongoose.model('StatsCourse', courseSchema),
    Project: mongoose.model('StatsProject', projectSchema),
    Extension: mongoose.model('StatsExtension', extensionSchema),
  }
} catch (err) {
  models = {
    User: mongoose.model('StatsUser'),
    Submission: mongoose.model('StatsSubmission'),
    Course: mongoose.model('StatsCourse'),
    Project: mongoose.model('StatsProject'),
    Extension: mongoose.model('StatsExtension'),
  }
}

module.exports = {
  ...models,
  mongoose,
}
