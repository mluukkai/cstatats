const { ApplicationError } = require('@util/customErrors')
const { ADMINS, formProject } = require('@util/common')
const models = require('@db/models')

const create = async (req, res) => {
  let project = await models
    .Project
    .findById(req.params.id)
    .exec()

  if (project === null) {
    res.status(400).send({ error: 'miniproject id was not valid' })
  } else {
    const user = req.currentUser

    project.users.push(user._id)
    await project.save()

    user.project = project._id
    await user.save()

    project = await models
      .Project
      .findById(req.params.id)
      .populate('users')
      .exec()

    res.send(formProject(project))
  }
}

const createMeeting = async (req, res) => {
  const { username } = req.currentUser

  if (!ADMINS.includes(username)) throw new ApplicationError('Not authorized', 403)

  const id = req.params.id
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

  const id = req.params.id
  const instructor = req.body.instructor

  const project = await models
    .Project
    .findById(req.params.id)
    .exec()

  project.instructor = instructor
  const result = await project.save()

  res.send(result)
}

const deleteMeeting = async (req, res) => {
  const { username } = req.currentUser

  if (!ADMINS.includes(username)) throw new ApplicationError('Not authorized', 403)

  const id = req.params.id

  const project = await models
    .Project
    .findById(req.params.id)
    .exec()

  project.meeting = null
  const result = await project.save()

  res.send(result)
}

const deleteInstructor = async (req, res) => {
  const { username } = req.currentUser

  if (!ADMINS.includes(username)) throw new ApplicationError('Not authorized', 403)

  const id = req.params.id

  const project = await models
    .Project
    .findById(req.params.id)
    .exec()

  project.instructor = null
  const result = await project.save()

  res.send(result)
}

module.exports = {
  create,
  createMeeting,
  createInstructor,
  deleteMeeting,
  deleteInstructor,
}
