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

const responseObject = (exam, questions) => {
  return {
    questions: exam.completed ? questions : questions.map(filterCorrect),
    answers: exam.answers,
    points: exam.completed ? exam.points : undefined,
    completed: exam.completed,
    starttime: exam.starttime,
  }
}

const endExamIfOvertime = async (exam, questions) => {
  const now = moment()
  //const endTime = moment(exam.starttime).add(4, 'hours')
  const endTime = moment(exam.starttime).add(10, 'seconds')

  if (now.isAfter(endTime)) {
    exam.completed = true
    exam.endtime = new Date()
    exam.points = getScore(exam.answers, questions)

    await exam.save()
  }
}

const endExam = async (req, res) => {
  const user = await models.User.findById(req.params.studentId)
  const exam = await models.Exam.findOne({ username: user.username })
  exam.endtime = new Date()
  exam.completed = true

  const questions = getQuestions()

  exam.points = getScore(exam.answers, questions)

  exam.save()

  res.send(responseObject(exam, questions))
}

/*
  endpoints
*/

const startExam = async (req, res) => {
  // const { username } = req.currentUser
  // const user =  models.User.findOne({ username })
  const user = await models.User.findById(req.params.studentId)
  // console.log(user)

  const questions = getQuestions().map(filterCorrect)
  const answers = initialAnswers(questions)

  await models.Exam.deleteMany({ username: user.username })

  const exam = new models.Exam({
    username: user.username,
    user: req.params.studentId,
    answers,
    starttime: new Date(),
    completed: false,
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
  const user = await models.User.findById(req.params.studentId)
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
  const user = await models.User.findById(req.params.studentId)
  const exam = await models.Exam.findOne({ username: user.username })
  exam.answers = req.body

  await exam.save()

  const questions = getQuestions()

  await endExamIfOvertime(exam, questions)

  res.send(responseObject(exam, questions))
}

/*
   debug
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
  resetExam,
  getAll,
}
