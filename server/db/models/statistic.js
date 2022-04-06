const mongoose = require('mongoose')

const StatisticSchema = new mongoose.Schema({
  name: String,
  stats: Object,
  time: Date,
})

module.exports = StatisticSchema
