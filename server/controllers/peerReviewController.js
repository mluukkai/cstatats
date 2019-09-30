const PEER_REVIEW_QUESTIONS = require('@assets/peer_review_questions')

const create = async (req, res) => {
  const peerReview = req.body

  const user = req.currentUser

  user.peerReview = peerReview
  await user.save()

  res.send(peerReview)
}

const getQuestionsForCourse = async (req, res) => {
  res.send(PEER_REVIEW_QUESTIONS)
}

module.exports = {
  create,
  getQuestionsForCourse,
}
