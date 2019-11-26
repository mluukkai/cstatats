const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  fullName: String,
  name: String,
  term: String,
  year: Number,
  week: Number,
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
