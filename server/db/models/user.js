const uniqueString = require('unique-string')
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
  courseProgress: Object,
})

userSchema.methods.getProgressForCourse = function (courseName) {
  return (this.courseProgress || []).find(c => c.courseName === courseName) || { courseName }
}

userSchema.methods.updateCourseProgress = function (progress) {
  const newCourseProgress = (this.courseProgress || []).filter(c => c.courseName !== progress.courseName)
  newCourseProgress.push(progress)

  this.markModified('courseProgress')
  this.courseProgress = newCourseProgress
}

userSchema.methods.ensureRandom = function (courseName) {
  const progress = this.getProgressForCourse(courseName)
  if (progress.random) return

  progress.random = uniqueString()
  this.updateCourseProgress(progress)
}

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
      } else {
        quizAnswers[courseName][part].locked = false
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

const withExtendedSubmissions = (submissions, extensions) => {
  if (!extensions || !extensions.length) return submissions
  let copySubmissions = [...submissions]

  extensions.forEach((extension) => {
    const { from, to, courseName, extendsWith } = extension
    const toCourse = to || courseName
    extendsWith.forEach((ex) => {
      const { part, exercises } = ex
      const submissionForPart = submissions.find(s => s.courseName === toCourse && Number(s.week) === Number(part))
      // If there's a submission, don't extend the same part, unless it has more exercises
      if (submissionForPart && submissionForPart.exercises.length >= exercises.length) return
      if (submissionForPart) {
        copySubmissions = copySubmissions.filter(s => s.courseName !== toCourse || Number(s.week) !== Number(part))
      }
      const submissionExercises = []
      for (let index = 0; index < exercises; index++) {
        submissionExercises.push(index)
      }
      copySubmissions.push({
        courseName: toCourse,
        exercises: submissionExercises,
        comment: `credited from ${from}`,
        week: part,
        _id: `extension-${courseName}-${part}`,
      })
    })
  })
  return copySubmissions
}

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.quizAnswers = formatQuizzes(returnedObject.quizAnswers)
    returnedObject.access = ADMINS_BY_USER[returnedObject.username.toLowerCase()]
    returnedObject.name = returnedObject.name || `${returnedObject.first_names || ''} ${returnedObject.last_name || ''}`
    returnedObject.submissions = withExtendedSubmissions(returnedObject.submissions, returnedObject.extensions)
    const fields = [
      'id', 'username', 'name', 'student_number',
      'submissions', 'project', 'projectAccepted', 'peerReview',
      'extensions', 'quizAnswers', 'access', 'courseProgress',
    ]
    Object.keys(returnedObject).forEach((key) => {
      if (fields.includes(key)) return
      delete returnedObject[key]
    })
  },
})

module.exports = userSchema
