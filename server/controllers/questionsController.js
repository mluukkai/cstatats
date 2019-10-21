const { ApplicationError } = require('@util/customErrors')
const { isAdmin } = require('@util/common')
const quizData = require('@assets/quiz.json')
const moment = require('moment-timezone')

const removeAnswer = (question) => {
  const withoutAnswer = question.options.map(option => ({ text: option.text }))
  return { ...question, options: withoutAnswer }
}

const getAcualDeadline = (course, part) => {
  const deadlineHuman = course.timetable && course.timetable[part] && course.timetable[part].close
  if (!deadlineHuman) return undefined

  const acualDeadline = moment.tz(`${deadlineHuman} 12:00`, 'DD.MM.YYYY HH:mm', 'Europe/Helsinki').toDate() // Is acually UTC 0 because server
  return acualDeadline
}

const getAcualOpening = (course, part) => {
  const openingHuman = course.timetable && course.timetable[part] && course.timetable[part].open
  if (!openingHuman) return undefined

  const acualOpening = moment.tz(`${openingHuman} 00:01`, 'DD.MM.YYYY HH:mm', 'Europe/Helsinki').toDate() // Is acually UTC 0 because server
  return acualOpening
}

const beforeDeadline = (course, part) => {
  const deadline = getAcualDeadline(course, part)
  if (!deadline) return true

  const now = moment.tz('Europe/Helsinki').toDate()
  return deadline.getTime() > now.getTime()
}

const afterOpen = (course, part) => {
  const opens = getAcualOpening(course, part)
  if (!opens) return true

  const now = moment.tz('Europe/Helsinki').toDate()
  return opens.getTime() < now.getTime()
}

const questionAvailable = (question) => {
  const course = quizData.courses.find(course => Number(course.id) === Number(question.courseId))

  return afterOpen(course, question.part) && beforeDeadline(course, question.part)
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
  const acualOpening = getAcualOpening(course, part)
  const available = beforeDeadline(course, part) && afterOpen(course, part)
  const questions = quizData.questions.filter(question => String(question.part) === String(part) && Number(question.courseId) === Number(course.id))

  res.send({
    available,
    open: acualOpening,
    deadline: acualDeadline,
    questions: (isAdmin(req.currentUser.username) || available) ? questions.map(removeAnswer) : [],
  })
}

const submitOne = async (req, res) => {
  const chosenAnswers = req.body
  const { id } = req.params
  if (!chosenAnswers) throw new ApplicationError('Body should be an array', 400)
  const question = quizData.questions.find(q => q.id === id)
  if (!questionAvailable(question)) throw new ApplicationError('Too early or too late', 400)

  req.currentUser.quizAnswers = replaceAnswers(req.currentUser.quizAnswers, id, chosenAnswers)

  await req.currentUser.save()

  res.sendStatus(201)
}

const submitQuiz = async (req, res) => {
  const chosenAnswersObject = req.body
  if (!chosenAnswersObject) throw new ApplicationError('Body should be an object', 400)
  const answeredQuestionIds = Object.keys(chosenAnswersObject)
  const notAvailable = answeredQuestionIds.some(questionId => !questionAvailable(quizData.questions.find(q => Number(q.id) === Number(questionId))))
  if (notAvailable) throw new ApplicationError('Too early or too late', 400)

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
