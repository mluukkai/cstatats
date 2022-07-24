const _ = require('lodash')

const models = require('@db/models')
const { UserInputError } = require('@util/customErrors')
const logger = require('@util/logger')
const axios = require('axios')

const getOne = async (req, res) => {
  const user = await req.currentUser.populate('submissions').execPopulate()
  const project =
    user.project &&
    (await models.Project.findById(user.project).populate('users').exec())
  res.send({
    ...req.currentUser.toJSON(),
    project: project && project.toJSON(),
  })
}

const update = async (req, res) => {
  const { studentNumber, name, newsletterSubscription } = req.body

  req.currentUser.student_number =
    studentNumber || req.currentUser.student_number

  req.currentUser.name = name || req.currentUser.name

  req.currentUser.newsletterSubscription = _.isBoolean(newsletterSubscription)
    ? newsletterSubscription
    : req.currentUser.newsletterSubscription

  await req.currentUser.save()

  res.send(200)
}

const setCourseCompleted = async (req, res) => {
  const { courseName } = req.params
  const { language } = req.body

  const validLanguages = ['fi', 'sv', 'en']

  if (language && !validLanguages.includes(language)) {
    throw new UserInputError('Completion language is invalid')
  }

  const progress = req.currentUser.getProgressForCourse(courseName)

  progress.completed = new Date().toISOString()
  progress.language = language || null

  req.currentUser.updateCourseProgress(progress)
  req.currentUser.ensureRandom(courseName)

  await req.currentUser.save()

  res.send(req.currentUser.toJSON())
}

const setCourseNotCompleted = async (req, res) => {
  const { courseName } = req.params

  const progress = req.currentUser.getProgressForCourse(courseName)
  progress.completed = false
  progress.oodi = false
  progress.suotarReady = false
  req.currentUser.updateCourseProgress(progress)
  await req.currentUser.save()
  res.send(200)
}

const enrolmentStatus = async (req, res) => {
  const { courseCode } = req.params
  const { student_number: studentNumber } = req.currentUser

  const { IMPORTER_URL, IMPORTER_TOKEN } = process.env

  if (!IMPORTER_URL)
    return (
      res.send(undefined) &&
      logger.info('Missing IMPORTER_TOKEN env. Not checking enrolment status')
    )
  if (!IMPORTER_TOKEN)
    return (
      res.send(undefined) &&
      logger.info('Missing IMPORTER_TOKEN env. Not checking enrolment status')
    )
  if (!courseCode)
    return (
      res.send(undefined) &&
      logger.info('Some course must be missing a course code')
    )
  if (!studentNumber)
    return (
      res.send(undefined) && logger.info('User does not have a student number')
    )

  const url = `${IMPORTER_URL}/students/${studentNumber}/course-unit/${courseCode}/enrolments`
  const { data: enrolments } = await axios.get(url, {
    headers: { token: IMPORTER_TOKEN },
  })

  if (!enrolments.length) return res.send(false)

  res.send(true)
}

module.exports = {
  getOne,
  update,
  setCourseCompleted,
  setCourseNotCompleted,
  enrolmentStatus,
}
