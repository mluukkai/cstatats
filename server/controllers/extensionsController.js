const { ApplicationError } = require('@util/customErrors')
const { isAdmin } = require('@util/common')
const models = require('@db/models')
const fsopen18 = require('@assets/extension/fsopen18.json')
const fs18 = require('@assets/extension/fs18.json')
const fs19 = require('@assets/extension/fs19.json')

const create = async (req, res) => {
  const user = req.currentUser
  const { username } = user
  const { courseName } = req.params
  const { fromCourse, fromUsername, toWeek } = req.body
  const courseInfo = await models.Course.findOne({ name: courseName })
  if (!courseInfo) throw new ApplicationError('No such course', 404)

  let oldCourseUsers

  const userToMatch = fromUsername
  if (fromCourse === 'fullstackopen2018') {
    oldCourseUsers = fsopen18
  } else if (fromCourse === 'fullstack2018') {
    oldCourseUsers = fs18
  }

  const userInOldCourse = oldCourseUsers
    .find(s => s.username.toLowerCase() === userToMatch.toLowerCase())
  if (!userInOldCourse) throw new ApplicationError('No such user in old course', 404)

  const oldSubmissions = userInOldCourse
    .submissions
    .filter(s => s.week <= Number(toWeek))

  const extendsWith = oldSubmissions.map(s => ({
    part: s.week,
    exercises: s.exercise_count || s.exercises,
  }))

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
    courseName: courseInfo.name,
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

  const allStudents = await models.User.find()

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
