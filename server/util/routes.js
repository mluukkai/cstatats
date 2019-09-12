const Router = require('express')
const courses = require('@controllers/coursesController')
const users = require('@controllers/usersController')
const projects = require('@controllers/projectsController')
const sessions = require('@controllers/sessionsController')
const students = require('@controllers/studentsController')

const router = Router()

router.get('/', (req, res) => res.send('welcome to root'))

router.get('/:courses', courses.getAll)

router.get('/:course/info', courses.info)

router.get('/:course/extensionstats', courses.extensionstats)

router.get('/:course/stats', courses.stats)

router.post('/users/:username/peer_review', users.peerReview)

router.get('/:course/solution_files/:part', courses.solutionFiles)

router.get('/users/:username', users.getOne)

router.get('/:course/projects/repositories', courses.projectRepositories)

router.get('/:course/questions', courses.questions)

router.get('/:course/projects', courses.projects)

router.post('/projects/:id/meeting', projects.createMeeting)

router.post('/projects/:id/instructor', projects.createInstructor)

router.delete('/projects/:id/meeting', projects.deleteMeeting)

router.delete('/projects/:id/instructor', projects.deleteInstructor)

router.post('/projects/:id', projects.create)

router.post('/:course/projects', courses.createProject)

router.post('/:course/users/:username/exercises', courses.createSubmission)

router.post('/login', sessions.create)

router.get('/:course/students', courses.students)

router.get('/students/:student/submissions', students.submissions)

router.get('/:course/submissions/:week', courses.weeklySubmissions)

router.post('/:course/users/:username/extensions', courses.userExtensions)

module.exports = router
