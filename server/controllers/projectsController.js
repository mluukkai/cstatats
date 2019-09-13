const jwt = require('jsonwebtoken')

const { ApplicationError } = require('@util/customErrors')
const { ADMINS, TOKEN_SECRET, formProject } = require('@util/common')
const models = require('@db/models')

const create = async (req, res) => {
  const token = req.headers['x-access-token']
  const { username } = jwt.verify(token, TOKEN_SECRET)
  try {
    let project = await models
      .Project
      .findById(req.params.id)
      .exec()

    if (project === null) {
      res.status(400).send({ error: 'miniproject id was not valid' })
    } else {
      const user = await models.User.findOne({ username })

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
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: 'miniproject id was not valid' })
  }
}

const createMeeting = async (req, res) => {
  try {
    const token = req.headers['x-access-token'] || req.query.token
    const { username } = jwt.verify(token, TOKEN_SECRET)

    if (!ADMINS.includes(username)) {
      res.status(400).json({ error: 'not authorized' })
    }

    const id = req.params.id
    const time = req.body.meeting

    const project = await models
      .Project
      .findById(req.params.id)
      .exec()

    project.meeting = time
    const result = await project.save()

    res.send(result)
  } catch (e) {
    console.log(e)
    res.status(400).json({ error: e })
  }
}

const createInstructor = async (req, res) => {
  try {
    const token = req.headers['x-access-token'] || req.query.token
    const { username } = jwt.verify(token, TOKEN_SECRET)

    if (!ADMINS.includes(username)) {
      res.status(400).json({ error: 'not authorized' })
    }

    const id = req.params.id
    const instructor = req.body.instructor

    const project = await models
      .Project
      .findById(req.params.id)
      .exec()

    project.instructor = instructor
    const result = await project.save()

    res.send(result)
  } catch (e) {
    console.log(e)
    res.status(400).json({ error: e })
  }
}

const deleteMeeting = async (req, res) => {
  try {
    const token = req.headers['x-access-token'] || req.query.token
    const { username } = jwt.verify(token, TOKEN_SECRET)

    if (!ADMINS.includes(username)) {
      res.status(400).json({ error: 'not authorized' })
    }

    const id = req.params.id

    const project = await models
      .Project
      .findById(req.params.id)
      .exec()

    project.meeting = null
    const result = await project.save()

    res.send(result)
  } catch (e) {
    console.log(e)
    res.status(400).json({ error: e })
  }
}

const deleteInstructor = async (req, res) => {
  try {
    const token = req.headers['x-access-token'] || req.query.token
    const { username } = jwt.verify(token, TOKEN_SECRET)

    if (!ADMINS.includes(username)) {
      res.status(400).json({ error: 'not authorized' })
    }

    const id = req.params.id

    const project = await models
      .Project
      .findById(req.params.id)
      .exec()

    project.instructor = null
    const result = await project.save()

    res.send(result)
  } catch (e) {
    console.log(e)
    res.status(400).json({ error: e })
  }
}

module.exports = {
  create,
  createMeeting,
  createInstructor,
  deleteMeeting,
  deleteInstructor,
}
