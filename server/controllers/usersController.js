const quizData = require('@assets/quiz.json')
const { ApplicationError } = require('@util/customErrors')
const { formProject, getQuizAnswersScore, ADMINS_BY_USER } = require('@util/common')
const models = require('@db/models')

const getOne = async (req, res) => {
  const user = await req.currentUser.populate('submissions').execPopulate()

  const formatQuizzes = (quizAnswers) => {
    const courses = quizAnswers
      .reduce((acc, cur) => [...new Set([...acc, cur.course])], [])
      .map(courseId => quizData.courses.find(course => Number(course.id) === Number(courseId)))

    return courses.map((course) => {
      const score = getQuizAnswersScore(quizAnswers, course.name)
      const answers = quizAnswers.filter(a => Number(a.course) === Number(course.id))
      return {
        course: course.name,
        score,
        answers,
      }
    })
  }
  const response = {
    username: user.username,
    last_name: user.last_name,
    first_names: user.first_names,
    student_number: user.student_number,
    submissions: user.submissions,
    quizAnswers: formatQuizzes(user.quizAnswers),
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

const submissions = async (req, res) => {
  const formatSubmissions = sub => ({
    week: sub.week,
    hours: sub.time,
    exercises: sub.exercises,
    course: sub.courseName ? sub.courseName : 'fullstack',
  })

  const user = await models.User.findOne({ student_number: req.params.student }).populate('submissions').exec()

  res.send(user.submissions.map(formatSubmissions))
}

module.exports = {
  getOne,
  submissions,
}
