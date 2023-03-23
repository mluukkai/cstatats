const Router = require('express')
const { isAdmin } = require('@util/common')
const models = require('@db/models')
const registerUserMiddleware = require('@middleware/registerUserMiddleware')
const currentUserMiddleware = require('@middleware/currentUserMiddleware')
const certificates = require('@controllers/certificatesController')
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
const mailingLists = require('@controllers/mailingListsController')
const exam = require('@controllers/examController')

const router = Router()

router.get('/', (req, res) => res.send('welcome to root'))

router.get('/github/callback', sessions.githubCallback)
router.get('/github/auth', sessions.githubLogin)
router.get('/github/get_token', sessions.getToken)

router.get('/courses', courses.getAll)
router.get('/courses/:courseName/info', courses.info)
router.get('/courses/:courseName/stats', courses.stats)
router.get('/courses/:courseName/stats/generate', courses.generateStats)

router.get(
  '/external/courses/:courseName/completed',
  students.getCompletedCountForCourse,
)

router.get(
  '/courses/:courseName/projects/repositories',
  courses.projectRepositories,
)

router.get('/certificate/:courseName/:lang/:id', certificates.getCertificate)
router.get('/certificate/:courseName/:id', certificates.getCertificate)

router.use(registerUserMiddleware)
router.use(currentUserMiddleware)

router.post('/login', users.getOne)
router.delete('/logout', sessions.destroy)

router.get('/exams/:studentId', exam.getExam)
router.post('/exams/:studentId', exam.startExam)
router.delete('/exams/:studentId', exam.endExam)
router.get('/exams/:studentId/status', exam.getExamStatus)
router.put('/exams/:studentId', exam.setAnswers)
router.get('/exams/:studentId/beta', exam.isBeta)

router.put('/users', users.update)
router.get('/users/:username', users.getOne)
router.get('/users/enrolment_status/:courseCode', users.enrolmentStatus)

router.put('/courses/:courseName/setCompleted', users.setCourseCompleted)
router.put('/courses/:courseName/setNotCompleted', users.setCourseNotCompleted)

router.post('/courses/:courseName/extensions', extensions.create)
router.get('/courses/:courseName/extensionstats', extensions.stats)

router.get('/courses/:courseName/submissions/:week', submissions.weekly)
router.post('/courses/:courseName/submissions', submissions.create)

router.get(
  '/solutions/course/:courseName/part/:part/files',
  solutions.solutionFiles,
)
router.get(
  '/solutions/course/:courseName/part/:part/',
  solutions.getSolutionFile,
)

router.get(
  '/peer_review/course/:courseName/questions',
  peerReview.getQuestionsForCourse,
)
router.post('/peer_review', peerReview.create)

router.post('/courses/:courseName/projects', projects.create)
router.post('/projects/:id', projects.join)

router.get('/questions/course/:courseName/show', questions.getQuizzesForCourse)
router.get(
  '/questions/course/:courseName/part/:part',
  questions.getAllForCourseForPart,
)
router.post('/questions/course/:courseName/part/:part/lock', questions.lockPart)
router.get('/questions/:id', questions.getOne)
router.post('/questions/:id/answer', questions.submitOne)

const authenticateProjectInstructor = async (req, res, next) => {
  const { username } = req.currentUser
  const { id } = req.params
  const project = await models.Project.findById(id).exec()
  if (!project) return res.sendStatus(404)
  const { courseName } = project

  if (isAdmin(username, courseName)) return next()

  res.sendStatus(403)
}

router.get('/projects/:id', authenticateProjectInstructor, projects.getOne)
router.delete('/projects/:id', authenticateProjectInstructor, projects.destroy)
router.post(
  '/projects/:id/meeting',
  authenticateProjectInstructor,
  projects.createMeeting,
)
router.delete(
  '/projects/:id/meeting',
  authenticateProjectInstructor,
  projects.deleteMeeting,
)
router.post(
  '/projects/:id/instructor',
  authenticateProjectInstructor,
  projects.createInstructor,
)
router.delete(
  '/projects/:id/instructor',
  authenticateProjectInstructor,
  projects.deleteInstructor,
)

const authenticateCourseAdmin = (req, res, next) => {
  const { username } = req.currentUser
  const { courseName } = req.params
  if (isAdmin(username, courseName)) return next()
  return res.sendStatus(403)
}

router.post('/exams/:username/reset', authenticateCourseAdmin, exam.resetExam)
router.get('/moodle_exams', authenticateCourseAdmin, exam.getMoodle)
router.get('/exams', authenticateCourseAdmin, exam.getAll)

router.get('/exam_exceptions', authenticateCourseAdmin, exam.getExceptions)
router.post('/exam_exceptions', authenticateCourseAdmin, exam.createExceptions)
router.delete(
  '/exam_exceptions/:id',
  authenticateCourseAdmin,
  exam.deleteExceptions,
)

router.delete(
  '/course/:courseName/students/:username/completion',
  authenticateCourseAdmin,
  students.completionUpdate,
)

router.get(
  '/courses/:courseName/projects',
  authenticateCourseAdmin,
  courses.projects,
)
router.get(
  '/courses/:courseName/results',
  authenticateCourseAdmin,
  students.exportCourseResults,
)
router.put('/courses/:courseName', authenticateCourseAdmin, courses.update)
router.get(
  '/admins/course/:courseName',
  authenticateCourseAdmin,
  admins.getAllForCourse,
)

router.post(
  '/admins/mangel/:courseName',
  authenticateCourseAdmin,
  admins.suotarMangel,
)

router.post('/admins/sisu/', authenticateCourseAdmin, admins.sisu)

router.get(
  '/students/course/:courseName/',
  authenticateCourseAdmin,
  students.getAllForCourse,
)
router.get(
  '/students/course/:courseName/simple',
  authenticateCourseAdmin,
  students.getAllForCourseSimple,
)

router.get(
  '/students/course/:courseName/noquizz',
  authenticateCourseAdmin,
  students.getAllForCourseNoQuizz,
)
router.get(
  '/students/course/:courseName/completed',
  authenticateCourseAdmin,
  students.getCompletedForCourse,
)
router.put(
  '/students/:username/progress',
  authenticateCourseAdmin,
  students.updateProgress,
)

router.post(
  '/progress',
  authenticateCourseAdmin,
  students.updateStudentsProgress,
)

router.get(
  '/students/:username/course/:courseName/',
  authenticateCourseAdmin,
  students.getOne,
)
router.get(
  '/submissions/course/:courseName/week/:week/students/:username',
  authenticateCourseAdmin,
  submissions.getCourseWeek,
)

router.get(
  '/submissions/course/:courseName/students/:username',
  authenticateCourseAdmin,
  submissions.getCourse,
)

router.put(
  '/submissions/course/:courseName/week/:week/students/:username',
  authenticateCourseAdmin,
  submissions.updateCourseWeek,
)
router.delete(
  '/submissions/course/:courseName/week/:week/students/:username',
  authenticateCourseAdmin,
  submissions.deleteOne,
)

const authenticateAdmin = (req, res, next) => {
  const { username } = req.currentUser
  if (isAdmin(username)) return next()

  return res.sendStatus(403)
}

router.post('/courses/', authenticateAdmin, courses.create)
router.put(
  '/projects/accept/:studentId',
  authenticateAdmin,
  projects.acceptStudent,
)
router.get(
  '/mailing_lists/:courseName',
  authenticateAdmin,
  mailingLists.getForCourse,
)
router.post(
  '/mailing_lists/send_to_recipients',
  authenticateAdmin,
  mailingLists.sendToRecipients,
)
router.post(
  '/mailing_lists/send_to_course/:courseName',
  authenticateAdmin,
  mailingLists.sendToCourse,
)

module.exports = router
