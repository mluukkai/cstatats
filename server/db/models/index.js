const mongoose = require('mongoose')
const user = require('@db/models/user')
const course = require('@db/models/course')
const submission = require('@db/models/submission')
const extension = require('@db/models/extension')
const project = require('@db/models/project')
const statistic = require('@db/models/statistic')
const exam = require('@db/models/exam')
const failedExam = require('@db/models/failed_exam')
const examException = require('@db/models/exam_exception')

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

try {
  models.Exam = mongoose.model('StatsExam', exam)
} catch (err) {
  models.Exam = mongoose.model('StatsExam')
}

try {
  models.FailedExam = mongoose.model('StatsFailedExam', failedExam)
} catch (err) {
  models.FailedExam = mongoose.model('StatsFailedExam')
}

try {
  models.ExamException = mongoose.model('StatsExamException', examException)
} catch (err) {
  models.ExamException = mongoose.model('StatsExamException')
}

module.exports = {
  ...models,
  mongoose,
}
