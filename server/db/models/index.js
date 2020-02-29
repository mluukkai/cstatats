const mongoose = require('mongoose')
const user = require('@db/models/user')
const course = require('@db/models/course')
const submission = require('@db/models/submission')
const extension = require('@db/models/extension')
const project = require('@db/models/project')

const { MONGO_URL } = require('@util/common')

if (!mongoose.connection.readyState) mongoose.connect(MONGO_URL)
mongoose.Promise = global.Promise

console.log('USING mongo', MONGO_URL)

let models
try {
  models = {
    User: mongoose.model('StatsUser', user),
    Submission: mongoose.model('StatsSubmission', submission),
    Course: mongoose.model('StatsCourse', course),
    Project: mongoose.model('StatsProject', project),
    Extension: mongoose.model('StatsExtension', extension),
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
