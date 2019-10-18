const { ApplicationError } = require('@util/customErrors')
const quizData = require('@assets/quiz.json')
const moment = require('moment-timezone')

const removeAnswer = (question) => {
  const withoutAnswer = question.options.map(option => ({ text: option.text }))
  return { ...question, options: withoutAnswer }
}

const getAcualDeadline = (course, part) => {
  const deadlineHuman = course.deadlines && course.deadlines[part]
  if (!deadlineHuman) return undefined

  const acualDeadline = moment.tz(`${deadlineHuman} 23:59`, 'DD.MM.YYYY HH:mm', 'Europe/Helsinki').toDate() // Is acually UTC 0 because server
  return acualDeadline
}

const beforeDeadline = (question) => {
  const course = quizData.courses.find(course => Number(course.id) === Number(question.courseId))
  const deadline = getAcualDeadline(course, question.part)
  if (!deadline) return true

  const now = moment.tz('Europe/Helsinki').toDate()
  return deadline.getTime() > now.getTime()
}

const replaceAnswers = (oldAnswers, questionId, newAnswers) => {
  const question = quizData.questions.find(q => Number(q.id) === Number(questionId))
  const filteredAnswers = oldAnswers.filter(answer => Number(question.id) !== Number(answer.questionId))

  const newAnswersWithValidityAndQuestionId = newAnswers.map((answer) => {
    const chosenOption = question.options.find(option => option.text === answer.text)
    if (!chosenOption) throw new ApplicationError(`No such option ${answer.text}`, 404)

    return { ...chosenOption, questionId: question.id, part: question.part, course: question.courseId }
  })

  return [...filteredAnswers, ...newAnswersWithValidityAndQuestionId]
}

const getOne = async (req, res) => {
  const { id } = req.params

  const question = quizData.questions.find(question => Number(question.id) === Number(id))
  if (!question) throw new ApplicationError('Question not found', 404)

  res.send(removeAnswer(question))
}

const getAllForCourseForPart = async (req, res) => {
  const { courseName, part } = req.params
  const course = quizData.courses.find(course => courseName === course.name)
  if (!course) throw new ApplicationError('No such course', 404)
  const acualDeadline = getAcualDeadline(course, part)
  const questions = quizData.questions.filter(question => String(question.part) === String(part) && Number(question.courseId) === Number(course.id))

  res.send({ deadline: acualDeadline, questions: questions.map(removeAnswer) })
}

const submitOne = async (req, res) => {
  const chosenAnswers = req.body
  const { id } = req.params
  if (!chosenAnswers) throw new ApplicationError('Body should be an array', 400)
  const question = quizData.questions.find(q => q.id === id)
  if (!beforeDeadline(question)) throw new ApplicationError('Too late', 400)

  req.currentUser.quizAnswers = replaceAnswers(req.currentUser.quizAnswers, id, chosenAnswers)

  await req.currentUser.save()

  res.sendStatus(201)
}

const submitQuiz = async (req, res) => {
  const chosenAnswersObject = req.body
  if (!chosenAnswersObject) throw new ApplicationError('Body should be an object', 400)
  const answeredQuestionIds = Object.keys(chosenAnswersObject)
  const tooLate = answeredQuestionIds.some(questionId => !beforeDeadline(quizData.questions.find(q => Number(q.id) === Number(questionId))))
  console.log('Toolate?', tooLate)
  if (tooLate) throw new ApplicationError('Too late', 400)

  req.currentUser.quizAnswers = answeredQuestionIds
    .reduce(
      (prevAnswers, questionId) => replaceAnswers(prevAnswers, questionId, chosenAnswersObject[questionId]),
      req.currentUser.quizAnswers,
    )

  await req.currentUser.save()

  res.sendStatus(201)
}

module.exports = {
  getOne,
  getAllForCourseForPart,
  submitOne,
  submitQuiz,
}
