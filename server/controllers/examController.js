/* eslint-disable no-param-reassign */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const models = require('@db/models')
const moment = require('moment')

const filterCorrect = (q) => {
  // eslint-disable-next-line no-param-reassign
  return { ...q, correct: null }
}

const getQuestions = () => {
  try {
    const examIds = require('@assets/exam/ids.json')
    return examIds.map((id) => require(`@assets/exam/${id}.json`))
  } catch {
    return []
  }
}

const initialAnswers = (questions) => {
  const qIds = questions.map((q) => Number(q.id))
  return qIds.reduce((obj, id) => {
    // eslint-disable-next-line no-param-reassign
    obj[id] = []
    return obj
  }, {})
}

const getScore = (answers, questions) => {
  const qIds = questions.map((q) => Number(q.id))

  let score = 0

  // eslint-disable-next-line no-restricted-syntax
  for (const id of qIds) {
    const question = questions.find((q) => Number(q.id) === id)
    const selectionIds = question.selections.fi.map((s) => s.id)

    const right = question.correct
    const answered = answers[id]

    let corrects = 0
    // eslint-disable-next-line no-restricted-syntax
    for (const s of selectionIds) {
      if (right.includes(s) && answered.includes(s)) {
        corrects += 1
      }
      if (!right.includes(s) && !answered.includes(s)) {
        corrects += 1
      }
    }

    score += corrects / selectionIds.length
  }

  return score
}

const timeLimits = {
  // shouldEnd: [2, 'hours]
  shouldEnd: [10, 'seconds'],
  shouldHideResult: [1, 'minutes'],
  canDoAgain: [10, 'minutes'],
}

const endExamIfOvertime = async (exam, questions) => {
  const now = moment()
  const endTime = moment(exam.starttime).add(
    timeLimits.shouldEnd[0],
    timeLimits.shouldEnd[1],
  )

  if (!exam.completed && now.isAfter(endTime)) {
    exam.completed = true
    exam.endtime = new Date()
    exam.points = getScore(exam.answers, questions)
    exam.passed = exam.points >= questions.length / 2

    await exam.save()
  }
}

const endedLongTimeAgo = (exam) => {
  if (!exam.completed) {
    return false
  }

  return moment(exam.endtime)
    .add(timeLimits.shouldHideResult[0], timeLimits.shouldHideResult[1])
    .isBefore(moment())
}

const canDoAgain = (exam) => {
  if (!exam.completed || exam.passed) {
    return false
  }

  return moment().isAfter(
    moment(exam.endtime).add(
      timeLimits.canDoAgain[0],
      timeLimits.canDoAgain[1],
    ),
  )
}

const responseObject = (exam, questions) => {
  const endedYesterday = endedLongTimeAgo(exam)

  const questionsForResponse = exam.completed
    ? questions
    : questions.map(filterCorrect)

  return {
    endedYesterday,
    questions: endedYesterday
      ? questions.map((q) => ({ id: q.id }))
      : questionsForResponse,
    answers: endedYesterday ? [] : exam.answers,
    points: exam.completed ? exam.points : undefined,
    completed: exam.completed,
    starttime: exam.starttime,
    endtime: exam.completed ? exam.endtime : undefined,
    retryAllowed: canDoAgain(exam),
    passed: exam.passed,
  }
}

/*
  endpoints
*/

const endExam = async (req, res) => {
  const user = req.currentUser
  const exam = await models.Exam.findOne({ username: user.username })
  exam.endtime = new Date()
  exam.completed = true

  const questions = getQuestions()

  exam.points = getScore(exam.answers, questions)

  exam.passed = exam.points >= questions.length / 2

  await exam.save()

  res.send(responseObject(exam, questions))
}

const startExam = async (req, res) => {
  const user = req.currentUser

  const questions = getQuestions().map(filterCorrect)
  const answers = initialAnswers(questions)

  const exams = await models.Exam.find({ username: user.username })

  console.log(exams)

  await models.Exam.deleteMany({ username: user.username })

  const exam = new models.Exam({
    username: user.username,
    user: user.id,
    answers,
    starttime: new Date(),
    completed: false,
    passed: false,
  })

  await exam.save()

  res.send({
    questions,
    answers,
    starttime: exam.starttime,
    completed: false,
  })
}

const getExam = async (req, res) => {
  const user = req.currentUser
  const exam = await models.Exam.findOne({ username: user.username })

  if (!exam) {
    return res.send({
      doesNotExist: true,
    })
  }

  const questions = getQuestions()

  await endExamIfOvertime(exam, questions)

  res.send(responseObject(exam, questions))
}

const setAnswers = async (req, res) => {
  // eslint-disable-next-line prefer-destructuring
  const user = req.currentUser
  const exam = await models.Exam.findOne({ username: user.username })
  exam.answers = req.body

  await exam.save()

  const questions = getQuestions()

  await endExamIfOvertime(exam, questions)

  res.send(responseObject(exam, questions))
}

const getExamStatus = async (req, res) => {
  const user = req.currentUser
  const exam = await models.Exam.findOne({ username: user.username })

  if (!exam) {
    return res.send({
      doesNotExist: true,
    })
  }

  console.log(exam)

  res.send({
    passed: exam.passed,
    endtime: exam.endtime,
  })
}

/*
   debug admin only 
 */

const getAll = async (req, res) => {
  const exams = await models.Exam.find({})

  res.send(exams)
}

const resetExam = async (req, res) => {
  const user = await models.User.findById(req.params.studentId)
  await models.Exam.deleteMany({ username: user.username })

  res.send({ reset: 'doned!' })
}

module.exports = {
  setAnswers,
  startExam,
  getExam,
  endExam,
  getExamStatus,
  resetExam,
  getAll,
}
