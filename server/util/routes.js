const Router = require('express')
const courses = require('@controllers/coursesController')
const users = require('@controllers/usersController')
const submissions = require('@controllers/submissionsController')
const extensions = require('@controllers/extensionsController')
const projects = require('@controllers/projectsController')
const sessions = require('@controllers/sessionsController')

const router = Router()

router.get('/', (req, res) => res.send('welcome to root'))

router.post('/login', users.getOne)
router.delete('/logout', sessions.destroy)

router.get('/courses', courses.getAll)
router.get('/courses/:courseName/info', courses.info)
router.get('/courses/:courseName/stats', courses.stats)
router.get('/courses/:courseName/solution_files/:part', courses.solutionFiles)
router.get('/courses/:courseName/projects/repositories', courses.projectRepositories)
router.get('/courses/:courseName/questions', courses.questions)
router.get('/courses/:courseName/projects', courses.projects)

router.post('/courses/:courseName/users/:username/extensions', extensions.create)
router.get('/courses/:courseName/extensionstats', extensions.stats)

router.get('/courses/:courseName/submissions/:week', submissions.weekly)
router.post('/courses/:courseName/users/:username/exercises', submissions.create)

router.get('/users/:username', users.getOne)
router.post('/users/:username/peer_review', users.peerReview)
router.get('/students/:student/submissions', users.submissions)

router.post('/courses/:courseName/projects', projects.create)
router.post('/projects/:id/meeting', projects.createMeeting)
router.post('/projects/:id/instructor', projects.createInstructor)
router.delete('/projects/:id/meeting', projects.deleteMeeting)
router.delete('/projects/:id/instructor', projects.deleteInstructor)
router.post('/projects/:id', projects.join)

router.post('/courses/', courses.create)
router.put('/courses/:courseName', courses.update)
router.get('/courses/:courseName/students', courses.students)

module.exports = router
