const mongoose = require('mongoose')

const ExamSchema = new mongoose.Schema({
  username: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'StatsUser' },
  answers: Object,
  starttime: Date,
  endtime: Date,
  points: Number,
  completed: Boolean,
})

module.exports = ExamSchema
