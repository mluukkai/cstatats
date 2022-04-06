const mongoose = require('mongoose')
const user = require('@db/models/user')
const course = require('@db/models/course')
const submission = require('@db/models/submission')
const extension = require('@db/models/extension')
const project = require('@db/models/project')
const statistic = require('@db/models/statistic')

const { MONGO_URL } = require('@util/common')

if (!mongoose.connection.readyState) mongoose.connect(MONGO_URL)
mongoose.Promise = global.Promise

console.log('USING mongo', MONGO_URL)

const models = {}

try {
  models.User = mongoose.model('StatsUser', user)
} catch (err) {
  models.User = mongoose.model('StatsUser')
}

try {
  models.Submission = mongoose.model('StatsSubmission', submission)
} catch (err) {
  models.Submission = mongoose.model('StatsSubmission')
}

try {
  models.Course = mongoose.model('StatsCourse', course)
} catch (err) {
  models.Course = mongoose.model('StatsCourse')
}

try {
  models.Project = mongoose.model('StatsProject', project)
} catch (err) {
  models.Project = mongoose.model('StatsProject')
}

try {
  models.Extension = mongoose.model('StatsExtension', extension)
} catch (err) {
  models.Extension = mongoose.model('StatsExtension')
}

try {
  models.Statistic = mongoose.model('StatsStatistic', statistic)
} catch (err) {
  models.Statistic = mongoose.model('StatsStatistic')
}

/*
try {
  models = {
    User: mongoose.model('StatsUser', user),
    Submission: mongoose.model('StatsSubmission', submission),
    Course: mongoose.model('StatsCourse', course),
    Project: mongoose.model('StatsProject', project),
    Extension: mongoose.model('StatsExtension', extension),
    //Statistic: mongoose.model('StatsStatistic', statistic),
  }
} catch (err) {
  console.log(err)
  models = {
    User: mongoose.model('StatsUser'),
    Submission: mongoose.model('StatsSubmission'),
    Course: mongoose.model('StatsCourse'),
    Project: mongoose.model('StatsProject'),
    Extension: mongoose.model('StatsExtension'),
    //Statistic: mongoose.model('StatsStatistic'),
  }
}
*/

module.exports = {
  ...models,
  mongoose,
}
