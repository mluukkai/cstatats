const mongoose = require('mongoose')
const user = require('@db/models/user')
const course = require('@db/models/course')
const { MONGO_URL } = require('@util/common')

if (!mongoose.connection.readyState) mongoose.connect(MONGO_URL)
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

let models
try {
  models = {
    User: mongoose.model('StatsUser', user),
    Submission: mongoose.model('StatsSubmission', submissionSchema),
    Course: mongoose.model('StatsCourse', course),
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
