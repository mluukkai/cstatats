const models = require('@db/models')

const getOne = async (req, res) => {
  const user = await req.currentUser.populate('submissions').execPopulate()
  const project = user.project && await models.Project.findById(user.project).populate('users').exec()
  res.send({
    ...req.currentUser.toJSON(),
    project: project && project.toJSON(),
  })
}

const update = async (req, res) => {
  const { studentNumber, name } = req.body

  req.currentUser.student_number = studentNumber || req.currentUser.student_number
  req.currentUser.name = name || req.currentUser.name

  await req.currentUser.save()
  res.send(200)
}

module.exports = {
  getOne,
  update,
}
