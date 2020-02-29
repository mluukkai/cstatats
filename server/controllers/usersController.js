const models = require('@db/models')

const getOne = async (req, res) => {
  const user = await req.currentUser.populate('submissions').execPopulate()
  const project = user.project && await models.Project.findById(user.project).populate('users').exec()
  res.send({
    ...req.currentUser.toJSON(),
    project: project && project.toJSON(),
  })
}

module.exports = {
  getOne,
}
