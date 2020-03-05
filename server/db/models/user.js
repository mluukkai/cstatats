const mongoose = require('mongoose')
const quizData = require('@assets/quiz.json')
const { getQuizScoreInPart, ADMINS_BY_USER, beforeDeadline } = require('@util/common')

const userSchema = new mongoose.Schema({
  username: String,
  student_number: String,
  token: String,
  email: String, // email from github
  name: String, // Full name, can be changed
  hy_email: String, // email from shibboleth
  admin: {
    type: Boolean,
    default: false,
  },
  first_names: String, // From shibboleth
  last_name: String, // From shibboleth
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StatsSubmission' }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsProject' },
  quizAnswers: Object,
  projectAccepted: Boolean,
  peerReview: Object,
  extensions: Object,
})

const formatQuizzes = (quizAnswers = {}) => {
  const courseNames = Object.keys(quizAnswers)
  courseNames.forEach((courseName) => {
    const parts = Object.keys(quizAnswers[courseName])
    parts.forEach((part) => {
      const quizDataCourse = quizData.courses.find(c => c.name === courseName)
      const tooSoonForAnswers = beforeDeadline(quizDataCourse, part)
      const coursePart = quizAnswers[courseName][part] || {}
      const answers = coursePart.answers || []
      if (coursePart.locked) {
        quizAnswers[courseName][part].score = getQuizScoreInPart(answers, courseName, part)
      }
      if (tooSoonForAnswers || !coursePart.locked) {
        answers.forEach((answ) => {
          delete answ.right
        })
      }
      quizAnswers[courseName][part].answers = answers
    })
  })
  return quizAnswers
}

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.quizAnswers = formatQuizzes(returnedObject.quizAnswers)
    returnedObject.access = ADMINS_BY_USER[returnedObject.username.toLowerCase()]
    returnedObject.name = returnedObject.name || `${returnedObject.first_names || ''} ${returnedObject.last_name || ''}`
    const fields = [
      'id', 'username', 'name', 'student_number',
      'submissions', 'project', 'projectAccepted', 'peerReview',
      'extensions', 'quizAnswers', 'access',
    ]
    Object.keys(returnedObject).forEach((key) => {
      if (fields.includes(key)) return
      delete returnedObject[key]
    })
  },
})

module.exports = userSchema
