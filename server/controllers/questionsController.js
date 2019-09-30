const { ApplicationError } = require('@util/customErrors')
const quizData = require('@assets/quiz.json')

const removeAnswer = (question) => {
  const withoutAnswer = question.options.map(option => ({ text: option.text }))
  return { ...question, options: withoutAnswer }
}

const replaceAnswers = (oldAnswers, questionId, newAnswers) => {
  const question = quizData.questions.find(q => Number(q.id) === Number(questionId))
  const filteredAnswers = oldAnswers.filter(answer => Number(question.id) !== Number(answer.questionId))

  const newAnswersWithValidityAndQuestionId = newAnswers.map((answer) => {
    const chosenOption = question.options.find(option => option.text === answer.text)
    if (!chosenOption) throw new ApplicationError(`No such option ${answer.text}`, 404)

    return { ...chosenOption, questionId: question.id }
  })

  return [...filteredAnswers, ...newAnswersWithValidityAndQuestionId]
}

const getOne = async (req, res) => {
  const { id } = req.params

  const question = quizData.questions.find(question => Number(question.id) === Number(id))
  if (!question) throw new ApplicationError('Question not found', 404)

  res.send(removeAnswer(question))
}

const getAllForCourseForWeek = async (req, res) => {
  const { courseName, partNumber } = req.params
  const course = quizData.courses.find(course => courseName === course.name)
  if (!course) throw new ApplicationError('No such course', 404)
  const questions = quizData.questions.filter(question => Number(question.partNumber) === Number(partNumber) && Number(question.courseId) === Number(course.id))

  res.send(questions.map(removeAnswer))
}

const submitOne = async (req, res) => {
  const chosenAnswers = req.body
  if (!chosenAnswers) throw new ApplicationError('Body should be an array', 400)

  req.currentUser.quizAnswers = replaceAnswers(req.currentUser.quizAnswers, req.params.id, chosenAnswers)

  await req.currentUser.save()

  res.sendStatus(201)
}

const submitQuiz = async (req, res) => {
  const chosenAnswersObject = req.body
  if (!chosenAnswersObject) throw new ApplicationError('Body should be an object', 400)
  req.currentUser.quizAnswers = Object.keys(chosenAnswersObject)
    .reduce(
      (prevAnswers, questionId) => replaceAnswers(prevAnswers, questionId, chosenAnswersObject[questionId]),
      req.currentUser.quizAnswers,
    )

  await req.currentUser.save()

  res.sendStatus(201)
}

module.exports = {
  getOne,
  getAllForCourseForWeek,
  submitOne,
  submitQuiz,
}
