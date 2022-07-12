const mongoose = require('mongoose')

const ExamExceptionSchema = new mongoose.Schema({
  username: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsUser' },
  beta: Boolean,
  passed: Boolean,
})

module.exports = ExamExceptionSchema
