const mongoose = require('mongoose')

const FailedExamSchema = new mongoose.Schema({
  username: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsUser' },
  answers: Object,
  starttime: Date,
  endtime: Date,
  points: Number,
  completed: Boolean,
  passed: Boolean,
  order: Object,
})

module.exports = FailedExamSchema
