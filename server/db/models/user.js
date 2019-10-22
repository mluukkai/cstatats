const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  student_number: String,
  hy_email: String,
  admin: Boolean,
  first_names: String,
  last_name: String,
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StatsSubmission' }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsProject' },
  quizAnswers: Object,
  projectAccepted: Boolean,
  peerReview: Object,
  extensions: Object,
})

module.exports = userSchema
