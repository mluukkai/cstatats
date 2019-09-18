const { ApplicationError } = require('@util/customErrors')
const { formProject } = require('@util/common')
const models = require('@db/models')

const getOne = async (req, res) => {
  const user = req.currentUser.populate('submissions')

  const response = {
    username: user.username,
    last_name: user.last_name,
    first_names: user.first_names,
    student_number: user.student_number,
    submissions: user.submissions,
    project: null,
    projectAccepted: user.projectAccepted,
    peerReview: user.peerReview,
    extensions: user.extensions,
  }

  if (user.project !== null) {
    const project = await models
      .Project
      .findById(user.project)
      .populate('users')

    response.project = formProject(project)
  }

  res.send(response)
}

const peerReview = async (req, res) => {
  const peerReview = req.body

  const user = req.currentUser

  user.peerReview = peerReview
  const resp = await user.save()
  console.log(resp)

  res.send(peerReview)
}

module.exports = {
  getOne,
  peerReview,
}
