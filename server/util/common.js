const common = require('@root/config/common')
const ADMINS = require('@assets/admins.json')
const quizData = require('@assets/quiz.json')

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

  const calculateScore = questionAnswer => (questionAnswer.right ? 1 : -0.5)

  const scores = quizAnswers.filter(a => Number(a.course) === Number(course.id)).reduce((acc, cur) => {
    const stateBefore = acc.find(p => p.part === cur.part) || { part: cur.part, score: 0 }
    const newScore = stateBefore.score + calculateScore(cur)
    return acc.filter(p => p.part !== cur.part).concat({ ...stateBefore, score: newScore })
  }, [])
  return scores
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
