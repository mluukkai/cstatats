const { ApplicationError } = require('@util/customErrors')
const { isAdmin } = require('@util/common')
const models = require('@db/models')
const fs = require('fs')
const path = require('path')

const courseNameToFile = {
  fullstackopen2018: 'fsopen18.json',
  fullstack2018: 'fs18.json',
  fullstack2019: 'fs19.json',
  fullstack2020: 'fs20.json',
}

const loadCourse = (fileName) => {
  try {
    const filePath = path.join(__dirname, '..', 'assets', 'extension', fileName)
    const file = fs.readFileSync(filePath)
    return JSON.parse(file)
  } catch (err) {
    throw new ApplicationError(`Extension file ${fileName} not available`, 404)
  }
}

const create = async (req, res) => {
  const user = req.currentUser
  const { username } = user
  const { courseName } = req.params
  const { fromCourse, fromUsername, toWeek } = req.body
  const courseInfo = await models.Course.findOne({ name: courseName })
  if (!courseInfo) throw new ApplicationError('No such course', 404)

  const userToMatch = fromUsername
  const fileName = courseNameToFile[fromCourse]
  if (!fileName) throw new ApplicationError('No such extension', 404)

  const oldCourseUsers = loadCourse(fileName)
  const userInOldCourse = oldCourseUsers
    .find(s => s.username.toLowerCase() === userToMatch.toLowerCase())
  if (!userInOldCourse) throw new ApplicationError('No such user in old course', 404)

  const oldSubmissions = userInOldCourse
    .submissions
    .filter(s => Number(s.week) <= Number(toWeek))

  const extendsWith = oldSubmissions.map((sub) => {
    let exerciseCount = sub.exercise_count || 0
    if (!exerciseCount && typeof sub.exercises === 'object' && sub.exercises.length) exerciseCount = sub.exercises.length
    if (!exerciseCount && typeof sub.exercises === 'number') exerciseCount = sub.exercise_count
    return {
      part: sub.week,
      exercises: exerciseCount,
    }
  })

  const ext = new models.Extension({
    extensionFrom: fromCourse,
    from: fromCourse,
    extensionTo: courseName,
    courseName,
    extendsWith,
    fromUsername,
    github: fromUsername,
    username,
    user: user._id,
    course: courseInfo._id,
  })

  await ext.save()

  if (!user.extensions) {
    user.extensions = []
  }

  const extensions = user.extensions.concat({
    from: fromCourse,
    courseName: courseInfo.name,
    to: courseInfo.name,
    extendsWith,
  })

  user.extensions = null
  await user.save()
  user.extensions = extensions
  await user.save()

  res.send(user.toJSON())
}

const stats = async (req, res) => {
  const { courseName } = req.params
  const notByAdmin = s => !isAdmin(s.username, courseName)

  const allStudents = await models.User.find().exec()

  const noAdmins = allStudents.filter(notByAdmin)

  const allExtensions = _.flatten(noAdmins
    .filter(s => s.extensions)
    .map(s => s.extensions))

  const extensions = _.flatten(allExtensions.filter(e => e.to === courseName || e.courseName === courseName)
    .map(e => e.extendsWith))

  const partlyExtensions = _.groupBy(extensions, e => e.part)

  const stats = Object.keys(partlyExtensions).reduce((acc, cur) => {
    acc[cur] = partlyExtensions[cur].length
    return acc
  }, {})

  res.send(stats)
}

module.exports = {
  create,
  stats,
}
