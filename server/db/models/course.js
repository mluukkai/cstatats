const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  fullName: String,
  name: {
    type: String,
    unique: true,
  },
  term: String,
  year: Number,
  week: {
    type: Number,
    default: 1,
  },
  exercises: [Number],
  enabled: {
    type: Boolean,
    default: false,
  },
  url: String,
  miniproject: {
    type: Boolean,
    default: false,
  },
  peerReviewOpen: {
    type: Boolean,
    default: false,
  },
  extension: {
    type: Boolean,
    default: false,
  },
})

module.exports = courseSchema
