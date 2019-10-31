const seedrandom = require('seedrandom')
const moment = require('moment-timezone')

const common = require('@root/config/common')
const ADMINS = require('@assets/admins.json')
const quizData = require('@assets/quiz.json')

// Fisher-Yates Shuffle
const shuffle = (originalArray, seedString = '') => {
  const array = [...originalArray]
  const getRandoms = seedrandom(seedString)
  let counter = array.length

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(getRandoms() * counter)
    // Decrease counter by 1
    counter--

    // And swap the last element with it
    const temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }

  return array
}

const getAcualDeadline = (course, part) => {
  const deadlineHuman = ((course.parts || {})[part] || {}).close
  if (!deadlineHuman) return undefined

  const acualDeadline = moment.tz(`${deadlineHuman} 23:59`, 'DD.MM.YYYY HH:mm', 'Europe/Helsinki').toDate() // Is acually UTC 0 because server
  return acualDeadline
}

const getAcualOpening = (course, part) => {
  const openingHuman = ((course.parts || {})[part] || {}).open
  if (!openingHuman) return undefined

  const acualOpening = moment.tz(`${openingHuman} 00:01`, 'DD.MM.YYYY HH:mm', 'Europe/Helsinki').toDate() // Is acually UTC 0 because server
  return acualOpening
}

const beforeDeadline = (course, part) => {
  if (!course) return false

  const deadline = getAcualDeadline(course, part)
  if (!deadline) return true

  const now = moment.tz('Europe/Helsinki').toDate()
  return deadline.getTime() > now.getTime()
}

const afterOpen = (course, part) => {
  if (!course) return false

  const opens = getAcualOpening(course, part)
  if (!opens) return true

  const now = moment.tz('Europe/Helsinki').toDate()
  return opens.getTime() < now.getTime()
}


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

const getQuizScoreInPart = (quizAnswers = [], part) => {
  const SCORING_START = 0.45
  const questionsInPart = quizData.questions.filter(q => String(part) === String(q.part))
  const amountTotal = questionsInPart.map(question => question.options.length).reduce((a, b) => a + b, 0)

  const zeroPoint = amountTotal * SCORING_START

  let amountRight = 0
  questionsInPart.forEach((question) => {
    question.options.forEach((option) => { // For each option in each question
      const studentCheckedThis = quizAnswers.find(a => Number(a.questionId) === Number(question.id) && String(a.text) === String(option.text))

      if (!studentCheckedThis) return
      if (studentCheckedThis.chosenValue !== option.right) return

      amountRight++ // If student selected an option that was right or left an option unchecked that was not right
    })
  })

  const pointsCalculated = Math.max(amountRight - zeroPoint, 0) / (amountTotal - zeroPoint)

  return {
    right: amountRight,
    total: amountTotal,
    points: pointsCalculated.toFixed(2),
  }
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
  getQuizScoreInPart,
  getAcualDeadline,
  getAcualOpening,
  afterOpen,
  beforeDeadline,
  shuffle,
}
