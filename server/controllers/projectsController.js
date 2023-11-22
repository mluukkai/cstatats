const { ApplicationError } = require('@util/customErrors')
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

  res.send(createdProject.toJSON())
}

const join = async (req, res) => {
  const { id } = req.params
  if (!id) throw ApplicationError('Id is required', 400)
  const safeId = id.trim()
  let project = await models.Project.findById(safeId).exec()

  if (!project) throw new ApplicationError('Miniproject was not found', 404)
  const user = req.currentUser

  project.users.push(user._id)
  await project.save()

  user.project = project._id
  await user.save()

  project = await models.Project.findById(safeId).populate('users').exec()

  res.send(project.toJSON())
}

const createMeeting = async (req, res) => {
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
  const { instructor } = req.body

  const project = await models.Project.findById(req.params.id).exec()

  project.instructor = instructor
  const result = await project.save()

  res.send(result)
}

const deleteMeeting = async (req, res) => {
  const project = await models.Project.findById(req.params.id).exec()

  project.meeting = null
  const result = await project.save()

  res.send(result)
}

const deleteInstructor = async (req, res) => {
  const project = await models.Project.findById(req.params.id).exec()

  project.instructor = null
  const result = await project.save()

  res.send(result)
}

const getOne = async (req, res) => {
  const project = await models.Project.findById(req.params.id).populate('users').exec()

  if (!project) throw new ApplicationError('Not found', 404)

  res.send(project)
}

const acceptStudent = async (req, res) => {
  const { studentId } = req.params
  if (!studentId) throw new ApplicationError('No student id', 400)

  const user = await models.User.findById(studentId).exec()

  if (user.project !== undefined && user.project !== null) {
    const project = await models.Project.findById(user.project)
    const users = project.users.filter(u => !u.equals(studentId))
    project.users = users
    await project.save()

    user.project = null
  }

  user.projectAccepted = true
  await user.save()

  res.send(200)
}

const resetProject = async (req, res) => {
  const { studentId } = req.params
  if (!studentId) throw new ApplicationError('No student id', 400)

  const user = await models.User.findById(studentId).exec()

  if (user.project !== undefined && user.project !== null) {
    const project = await models.Project.findById(user.project)
    const users = project.users.filter(u => !u.equals(studentId))
    project.users = users
    await project.save()

    user.project = null
  }

  await user.save()

  res.send(200)
}

const destroy = async (req, res) => {
  const projectId = req.params.id
  if (!projectId) throw new ApplicationError('Project id required', 400)

  const project = await models.Project.findById(projectId).populate('users').exec()

  if (!project) throw new ApplicationError('No such project', 404)

  const { users } = project

  await Promise.all(users.map((user) => {
    user.project = null
    return user.save()
  }))

  await project.delete()

  res.send(200)
}

module.exports = {
  create,
  join,
  destroy,
  createMeeting,
  createInstructor,
  deleteMeeting,
  deleteInstructor,
  getOne,
  acceptStudent,
  resetProject
}
