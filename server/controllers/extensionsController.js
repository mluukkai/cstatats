const { ApplicationError } = require('@util/customErrors')
const { ADMINS, QUESTIONS, formProject } = require('@util/common')
const models = require('@db/models')

const create = async (req, res) => {
  let user = req.currentUser
  const { username } = user
  const course = req.params.courseName
  const { body } = req

  const courseInfo = await models.Course.findOne({ name: course })


  console.log(body)

  let fromFs
  let userToMatch

  if (body.from === 'fullstackopen2018') {
    console.log('open')
    fromFs = require('./data/fsopen.json')
    userToMatch = body.github
  } else if (body.from === 'fullstack2018') {
    console.log('HY ')
    fromFs = require('./data/fsk18.json')
    userToMatch = username
  } else {
    // wtf
  }

  const submissions = fromFs
    .find(s => s.username === userToMatch)
    .submissions
    .filter(s => s.week <= Number(body.to))

  const extendsWith = submissions.map(s => ({
    part: s.week,
    exercises: s.exercise_count || s.exercises,
  }))

  const ext = new models.Extension({
    extensionFrom: body.from,
    extendsWith,
    github: req.body.github,
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
    from: body.from,
    to: courseInfo.name,
    extendsWith,
  })

  user.extensions = null
  await user.save()

  user.extensions = extensions

  await user.save()

  console.log(user)

  user = await models
    .User
    .findOne({ username })
    .populate('submissions')
    .exec()

  res.send(user)
}

const stats = async (req, res) => {
  const notByAdmin = s => !['mluukkai', 'testertester'].includes(s.username)

  const course = req.params.courseName

  const allStudents = await models.User.find()

  const noAdmins = allStudents.filter(notByAdmin)

  const allExtensions = _.flatten(noAdmins
    .filter(s => s.extensions)
    .map(s => s.extensions))

  const extensions = _.flatten(allExtensions.filter(e => e.to === course)
    .map(e => e.extendsWith))

  const partlyExtensions = _.groupBy(extensions, e => e.part)

  console.log(partlyExtensions)

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
