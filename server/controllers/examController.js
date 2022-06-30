/* eslint-disable global-require */
const examIds = require('@assets/exam/ids.json')
const models = require('@db/models')

const filterCorrect = (q) => {
  // eslint-disable-next-line no-param-reassign
  return { ...q, correct: null }
}

const getQuestions = () => {
  // eslint-disable-next-line import/no-dynamic-require
  return examIds.map((id) => require(`@assets/exam/${id}.json`))
}

const initialAnswers = (questions) => {
  const qIds = questions.map((q) => Number(q.id))
  return qIds.reduce((obj, id) => {
    // eslint-disable-next-line no-param-reassign
    obj[id] = []
    return obj
  }, {})
}

const startExam = async (req, res) => {
  // const { username } = req.currentUser
  // const user =  models.User.findOne({ username })
  const user = await models.User.findById(req.params.studentId)
  // console.log(user)

  const questions = getQuestions().map(filterCorrect)
  const answers = initialAnswers(questions)

  await models.Exam.deleteMany({})

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
  })
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

const endExam = async (req, res) => {
  const user = await models.User.findById(req.params.studentId)
  const exam = await models.Exam.findOne({ username: user.username })
  exam.endtime = new Date()
  exam.completed = true

  const questions = getQuestions()

  exam.points = getScore(exam.answers, questions)

  exam.save()

  res.send({
    questions,
    answers: exam.answers,
    points: exam.points,
    completed: exam.completed,
  })
}

const getExam = async (req, res) => {
  const user = await models.User.findById(req.params.studentId)
  const exam = await models.Exam.findOne({ username: user.username })

  const questions = getQuestions()

  res.send({
    questions: exam.completed ? questions : questions.map(filterCorrect),
    answers: exam.answers,
    points: exam.points,
    completed: exam.completed,
  })
}

const setAnswers = async (req, res) => {
  // eslint-disable-next-line prefer-destructuring
  const user = await models.User.findById(req.params.studentId)
  const exam = await models.Exam.findOne({ username: user.username })
  exam.answers = req.body

  await exam.save()

  res.send({
    questions: getQuestions(),
    answers: exam.answers,
  })
}

module.exports = {
  setAnswers,
  startExam,
  getExam,
  endExam,
}
