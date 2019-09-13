const jwt = require('jsonwebtoken')

const { ApplicationError } = require('@util/customErrors')
const { TOKEN_SECRET, formProject } = require('@util/common')
const models = require('@db/models')

const getOne = async (req, res) => {
  try {
    const token = req.headers['x-access-token'] || req.query.token
    const username = req.params.username
    const form_token = jwt.verify(token, TOKEN_SECRET)

    if (username !== form_token.username && form_token.username !== 'mluukkai') {
      console.log(username, form_token.username)
      res.status(500).send({ error: 'something went wrong...' })
      return
    }

    const user = await models
      .User
      .findOne({ username })
      .populate('submissions')
      .exec()

    const response = {
      username,
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
  } catch (e) {
    console.log(e)
    res.status(500).send({ error: 'something went wrong...' })
  }
}

const peerReview = async (req, res) => {
  try {
    const token = req.headers['x-access-token'] || req.query.token
    const username = req.params.username
    const form_token = jwt.verify(token, TOKEN_SECRET)

    if (username !== form_token.username && form_token.username !== 'mluukkai') {
      console.log(username, form_token.username)
      res.status(500).send({ error: 'something went wrong...' })
      return
    }

    const peerReview = req.body

    const user = await models
      .User
      .findOne({ username })
      .exec()

    user.peerReview = peerReview
    const resp = await user.save()
    console.log(resp)

    res.send(peerReview)
  } catch (e) {
    console.log(e)
    res.status(500).send({ error: 'something went wrong...' })
  }
}

module.exports = {
  getOne,
  peerReview,
}
