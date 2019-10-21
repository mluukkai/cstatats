const common = require('@root/config/common')
const ADMINS = require('@assets/admins.json')
const quizData = require('@assets/quiz.json')
const { groupBy } = require('lodash')

const sortAdminsByUser = () => {
  return Object.keys(ADMINS).reduce((acc, cur) => {
    if (cur === 'superadmins') {
      ADMINS[cur].forEach((uid) => {
        if (!acc[uid]) acc[uid] = []
        acc[uid].push({ group: cur })
      })
      return acc
    }

    ADMINS[cur].access.forEach((user) => {
      if (!acc[user.uid]) acc[user.uid] = []
      acc[user.uid].push({ group: cur, pages: user.pages })
    })
    return acc
  }, {})
}

const ADMINS_BY_COURSE = ADMINS
const ADMINS_BY_USER = sortAdminsByUser()
const getAdminsForACourse = (courseName) => {
  const courseAdmins = ADMINS_BY_COURSE[courseName]
  if (!courseAdmins || !courseAdmins.access) return []

  return courseAdmins.access.map(user => user.uid)
}

const isAdmin = (username, courseName) => {
  if (!courseName) return ADMINS.superadmins.includes(username)

  return [...ADMINS.superadmins, ...getAdminsForACourse(courseName)].includes(username)
}

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:mongo@db/mongo'
const PORT = process.env.PORT || 8000
const SHIBBOLETH_HEADERS = [
  'uid',
  'givenname', // First name
  'mail', // Email
  'schacpersonaluniquecode', // Contains student number
  'sn', // Last name
]

const getQuizAnswersScore = (quizAnswers, courseName) => {
  const course = quizData.courses.find(course => course.name === courseName)
  const answersInCourse = quizAnswers.filter(a => Number(a.course) === Number(course.id))
  const questionsInCourse = quizData.questions.filter(a => Number(a.courseId) === Number(course.id))
  const answersByPart = groupBy(answersInCourse, 'part')
  const questionsByPart = groupBy(questionsInCourse, 'part')
  const score = {}
  Object.keys(answersByPart).forEach((key) => {
    const amountRight = (answersByPart[key] || []).filter(a => a.right).length
    const amountTotal = questionsByPart[key].map(question => question.options.filter(a => a.right).length).reduce((a, b) => a + b, 0)
    score[key] = {
      right: amountRight,
      total: amountTotal,
      points: ((amountRight / amountTotal * 1.2) - 0.2).toFixed(2),
    }
  })
  return score
}

const formProject = (p) => {
  if (!p) return null

  const formUser = u => ({
    last_name: u.last_name,
    first_names: u.first_names,
    username: u.username,
  })

  return {
    name: p.name,
    github: p.github,
    _id: p._id,
    meeting: p.meeting,
    users: p.users.map(formUser),
  }
}

module.exports = {
  ...common,
  formProject,
  SHIBBOLETH_HEADERS,
  MONGO_URL,
  PORT,
  ADMINS_BY_COURSE,
  ADMINS_BY_USER,
  getAdminsForACourse,
  isAdmin,
  getQuizAnswersScore,
}
