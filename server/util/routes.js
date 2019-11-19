const Router = require('express')
const { isAdmin } = require('@util/common')
const admins = require('@controllers/adminsController')
const students = require('@controllers/studentsController')
const solutions = require('@controllers/solutionsController')
const courses = require('@controllers/coursesController')
const users = require('@controllers/usersController')
const peerReview = require('@controllers/peerReviewController')
const submissions = require('@controllers/submissionsController')
const extensions = require('@controllers/extensionsController')
const projects = require('@controllers/projectsController')
const sessions = require('@controllers/sessionsController')
const questions = require('@controllers/questionsController')

const router = Router()

router.get('/', (req, res) => res.send('welcome to root'))

router.post('/login', users.getOne)
router.delete('/logout', sessions.destroy)

router.get('/courses', courses.getAll)
router.get('/courses/:courseName/info', courses.info)
router.get('/courses/:courseName/stats', courses.stats)
router.get('/courses/:courseName/projects/repositories', courses.projectRepositories)
router.get('/courses/:courseName/projects', courses.projects)

router.post('/courses/:courseName/users/:username/extensions', extensions.create)
router.get('/courses/:courseName/extensionstats', extensions.stats)

router.get('/courses/:courseName/submissions/:week', submissions.weekly)
router.post('/courses/:courseName/users/:username/exercises', submissions.create)

router.get('/solutions/course/:courseName/part/:part/files', solutions.solutionFiles)
router.get('/solutions/course/:courseName/part/:part/', solutions.getSolutionFile)

router.get('/users/:username', users.getOne)

router.get('/peer_review/course/:courseName/questions', peerReview.getQuestionsForCourse)
router.post('/peer_review', peerReview.create)

router.post('/courses/:courseName/projects', projects.create)
router.post('/projects/:id', projects.join)

router.get('/questions/course/:courseName/show', questions.getQuizzesForCourse)
router.get('/questions/course/:courseName/part/:part', questions.getAllForCourseForPart)
router.post('/questions/course/:courseName/part/:part/lock', questions.lockPart)
router.get('/questions/:id', questions.getOne)
router.post('/questions/:id/answer', questions.submitOne)

const authenticateCourseAdmin = (req, res, next) => {
  const { username } = req.currentUser
  const { courseName } = req.params
  if (isAdmin(username, courseName)) return next()

  return res.sendStatus(403)
}

router.get('/projects/:id', authenticateCourseAdmin, projects.getOne)
router.post('/projects/:id/meeting', authenticateCourseAdmin, projects.createMeeting)
router.delete('/projects/:id/meeting', authenticateCourseAdmin, projects.deleteMeeting)
router.post('/projects/:id/instructor', authenticateCourseAdmin, projects.createInstructor)
router.delete('/projects/:id/instructor', authenticateCourseAdmin, projects.deleteInstructor)

router.put('/courses/:courseName', authenticateCourseAdmin, courses.update)
router.get('/admins/course/:courseName', authenticateCourseAdmin, admins.getAllForCourse)
router.get('/students/course/:courseName/', authenticateCourseAdmin, students.getAllForCourse)
router.get('/students/:studentNumber/course/:courseName/', authenticateCourseAdmin, students.getOne)

const authenticateAdmin = (req, res, next) => {
  const { username } = req.currentUser
  if (isAdmin(username)) return next()

  return res.sendStatus(403)
}

router.post('/courses/', authenticateAdmin, courses.create)
router.put('/projects/accept/:studentId', authenticateAdmin, projects.acceptStudent)

module.exports = router
