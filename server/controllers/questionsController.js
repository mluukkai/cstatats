const { ApplicationError } = require('@util/customErrors')
const { shuffle, beforeDeadline, afterOpen, getAcualDeadline, getAcualOpening } = require('@util/common')
const quizData = require('@assets/quiz.json')

const removeAnswer = (question) => {
  const withoutAnswer = question.options.map(option => ({ text: option.text }))
  return { ...question, options: withoutAnswer }
}

const shuffleOptions = seedString => (question) => {
  const shuffledOptions = shuffle(question.options, seedString)
  return { ...question, options: shuffledOptions }
}

const questionAvailable = (question) => {
  const course = quizData.courses.find(course => Number(course.id) === Number(question.courseId))

  return afterOpen(course, question.part) && beforeDeadline(course, question.part)
}

const replaceAnswers = (oldAnswers, questionId, newAnswers) => {
  const question = quizData.questions.find(q => Number(q.id) === Number(questionId))
  const filteredAnswers = oldAnswers.filter(answer => Number(question.id) !== Number(answer.questionId))

  const newAnswersWithValidityAndQuestionId = newAnswers
    .filter(answer => question.options.find(option => option.text === answer.text))
    .map(answer => ({ chosenValue: answer.chosenValue, ...question.options.find(option => option.text === answer.text) }))
    .map(chosenOption => ({ ...chosenOption, questionId: question.id, part: question.part, course: question.courseId }))

  return [...filteredAnswers, ...newAnswersWithValidityAndQuestionId]
}

const getOne = async (req, res) => {
  const { id } = req.params

  const question = quizData.questions.find(question => Number(question.id) === Number(id))
  if (!question) throw new ApplicationError('Question not found', 404)

  res.send(removeAnswer(question))
}

const getAllForCourseForPart = async (req, res) => {
  const user = req.currentUser
  const { courseName, part } = req.params
  const course = quizData.courses.find(course => courseName === course.name)
  const names = quizData.courses.map(course => course.name)
  if (!course) throw new ApplicationError('No such course', 404)
  const acualDeadline = getAcualDeadline(course, part)
  const acualOpening = getAcualOpening(course, part)
  const available = beforeDeadline(course, part) && afterOpen(course, part)
  const questions = quizData.questions.filter(question => String(question.part) === String(part) && Number(question.courseId) === Number(course.id))
  const partDescription = ((course.parts || {})[part] || {}).desc
  const shuffledQuestions = shuffle(questions.map(shuffleOptions(user.username)), user.username)

  if (!available && user.quizAnswers[courseName][part].locked) {
    return res.send({
      desc: partDescription,
      available,
      open: acualOpening,
      deadline: acualDeadline,
      questions: shuffledQuestions,
    })
  }

  res.send({
    desc: partDescription,
    available,
    open: acualOpening,
    deadline: acualDeadline,
    questions: available ? shuffledQuestions.map(removeAnswer) : [],
  })
}

const submitOne = async (req, res) => {
  const chosenAnswers = req.body
  const { id } = req.params
  if (!chosenAnswers) throw new ApplicationError('Body should be an array', 400)
  const question = quizData.questions.find(q => Number(q.id) === Number(id))
  const course = quizData.courses.find(c => Number(question.courseId) === Number(c.id))
  if (!questionAvailable(question)) throw new ApplicationError('Too early or too late', 400)
  const user = req.currentUser

  const locked = user.get(`quizAnswers.${course.name}.${question.part}.locked`) || false
  if (locked) throw new ApplicationError('You have already locked this question', 400)

  const previousAnswers = user.get(`quizAnswers.${course.name}.${question.part}.answers`) || []
  const newAnswers = replaceAnswers(previousAnswers, id, chosenAnswers)
  user.set(`quizAnswers.${course.name}.${question.part}.answers`, newAnswers)
  try {
    await user.save()
    res.sendStatus(200)
  } catch (err) {
    throw new ApplicationError('Unable to save', 500)
  }
}

const lockPart = async (req, res) => {
  const user = req.currentUser
  const { courseName, part } = req.params
  user.set(`quizAnswers.${courseName}.${part}.locked`, true)
  await user.save()
  res.sendStatus(200)
}

const getQuizzesForCourse = async (req, res) => {
  const { courseName } = req.params
  const course = quizData.courses.find(c => c.name === courseName)
  if (!course) return res.send([])

  const partArray = Object.keys(course.parts).map(part => ({
    part,
    open: getAcualOpening(course, part),
    close: getAcualDeadline(course, part),
  }))

  res.send(partArray)
}

module.exports = {
  getOne,
  getAllForCourseForPart,
  getQuizzesForCourse,
  submitOne,
  lockPart,
}
