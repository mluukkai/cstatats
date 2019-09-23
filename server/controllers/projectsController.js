const { ApplicationError } = require('@util/customErrors')
const { ADMINS, formProject } = require('@util/common')
const models = require('@db/models')

const create = async (req, res) => {
  const { username } = req.currentUser

  const course = req.params.courseName
  const { repository, name } = req.body

  const courseInfo = await models.Course.findOne({ name: course }).exec()

  const old = await models.Project.findOne({ name, courseName: course }).exec()
  if (old) throw new ApplicationError(409, 'Project name must be unique')

  const user = await models.User.findOne({ username }).exec()

  const project = new models.Project({
    name,
    github: repository,
    users: [user._id],
    courseName: course,
    course: courseInfo,
  })

  await project.save()

  user.project = project._id
  await user.save()

  const createdProject = await models.Project.findById(project.id).populate('users').exec()

  res.send(formProject(createdProject))
}

const join = async (req, res) => {
  let project = await models.Project.findById(req.params.id).exec()

  if (!project) throw new ApplicationError('Miniproject was not found', 404)
  const user = req.currentUser

  project.users.push(user._id)
  await project.save()

  user.project = project._id
  await user.save()

  project = await models.Project.findById(req.params.id).populate('users').exec()

  res.send(formProject(project))
}

const createMeeting = async (req, res) => {
  const { username } = req.currentUser

  if (!ADMINS.includes(username)) throw new ApplicationError('Not authorized', 403)

  const time = req.body.meeting

  const project = await models
    .Project
    .findById(req.params.id)
    .exec()

  project.meeting = time
  const result = await project.save()

  res.send(result)
}

const createInstructor = async (req, res) => {
  const { username } = req.currentUser

  if (!ADMINS.includes(username)) throw new ApplicationError('Not authorized', 403)

  const { instructor } = req.body

  const project = await models.Project.findById(req.params.id).exec()

  project.instructor = instructor
  const result = await project.save()

  res.send(result)
}

const deleteMeeting = async (req, res) => {
  const { username } = req.currentUser

  if (!ADMINS.includes(username)) throw new ApplicationError('Not authorized', 403)

  const project = await models.Project.findById(req.params.id).exec()

  project.meeting = null
  const result = await project.save()

  res.send(result)
}

const deleteInstructor = async (req, res) => {
  const { username } = req.currentUser

  if (!ADMINS.includes(username)) throw new ApplicationError('Not authorized', 403)


  const project = await models.Project.findById(req.params.id).exec()

  project.instructor = null
  const result = await project.save()

  res.send(result)
}

module.exports = {
  create,
  join,
  createMeeting,
  createInstructor,
  deleteMeeting,
  deleteInstructor,
}
