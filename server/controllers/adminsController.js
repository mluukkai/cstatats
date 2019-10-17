const { getAdminsForACourse } = require('@util/common')

const getAllForCourse = async (req, res) => {
  const { courseName } = req.params

  res.send(getAdminsForACourse(courseName))
}

module.exports = {
  getAllForCourse,
}
