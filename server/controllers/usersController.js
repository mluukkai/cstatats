const quizData = require('@assets/quiz.json')
const { ApplicationError } = require('@util/customErrors')
const { formProject, getQuizScoreInPart, ADMINS_BY_USER, beforeDeadline } = require('@util/common')
const models = require('@db/models')

const getOne = async (req, res) => {
  const user = await req.currentUser.populate('submissions').execPopulate()

  const formatQuizzes = (quizAnswers = {}) => {
    const courses = Object.keys(quizAnswers)
    courses.forEach((course) => {
      const parts = Object.keys(quizAnswers[course])
      parts.forEach((part) => {
        const quizDataCourse = quizData.courses.find(c => c.name === course)
        const tooSoonForAnswers = beforeDeadline(quizDataCourse, part)
        const coursePart = quizAnswers[course][part] || {}
        const answers = coursePart.answers || []
        if (coursePart.locked) {
          quizAnswers[course][part].score = getQuizScoreInPart(answers, part)
        }
        if (tooSoonForAnswers || !coursePart.locked) {
          answers.forEach((answ) => {
            delete answ.right
          })
        }
        quizAnswers[course][part].answers = answers
      })
    })
    return quizAnswers
  }

  const response = {
    username: user.username,
    last_name: user.last_name,
    first_names: user.first_names,
    student_number: user.student_number,
    submissions: user.submissions,
    quizAnswers: formatQuizzes(user.toObject().quizAnswers),
    project: null,
    projectAccepted: user.projectAccepted,
    peerReview: user.peerReview,
    extensions: user.extensions,
    access: ADMINS_BY_USER[user.username],
  }
  if (user.project) {
    const project = await models.Project.findById(user.project).populate('users').exec()

    response.project = formProject(project)
  }
  res.send(response)
}

module.exports = {
  getOne,
}
