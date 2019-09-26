const { ApplicationError } = require('@util/customErrors')
const quizData = require('../assets/quiz.json')

const removeAnswer = (question) => {
  const withoutAnswer = question.options.map(option => ({ text: option.text }))
  return { ...question, options: withoutAnswer }
}

const getOne = async (req, res) => {
  const { id } = req.params

  const question = quizData.questions.find(question => question.id == id)
  if (!question) throw new ApplicationError('Question not found', 404)

  res.send(removeAnswer(question))
}

const getAllForCourseForWeek = async (req, res) => {
  const { courseName, weekNumber } = req.params
  const course = quizData.courses.find(course => courseName == course.name)
  if (!course) throw new ApplicationError('No such course', 404)
  const questions = quizData.questions.filter(question => question.weekNumber == weekNumber && question.courseId == course.id)

  res.send(questions.map(removeAnswer))
}

const submit = async (req, res) => {
  const chosenAnswers = req.body
  if (!chosenAnswers) throw new ApplicationError('Body should be an array', 400)

  const question = quizData.questions.find(q => q.id == req.params.id)
  const oldAnswers = req.currentUser.quizAnswers.filter(answer => question.id != answer.questionId)

  const newAnswers = chosenAnswers.map((answer) => {
    const chosenOption = question.options.find(option => option.text == answer.text)
    if (!chosenOption) throw new ApplicationError(`No such option ${answer.text}`, 404)

    return { ...chosenOption, questionId: question.id }
  })

  req.currentUser.quizAnswers = [...oldAnswers, ...newAnswers]
  await req.currentUser.save()

  res.sendStatus(201)
}

module.exports = {
  getOne,
  getAllForCourseForWeek,
  submit,
}
