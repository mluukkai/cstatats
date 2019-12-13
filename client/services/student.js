import { callApi } from 'Utilities/apiConnection'

const getInCourse = async (courseName) => {
  const result = await callApi(`/students/course/${courseName}/`)
  return result.data
}

const getSubmission = async (courseName, week, studentNumber) => {
  const result = await callApi(`/submissions/course/${courseName}/week/${week}/students/${studentNumber}`)
  return result.data
}

const updateSubmission = async (courseName, week, studentNumber, payload) => {
  const result = await callApi(`/submissions/course/${courseName}/week/${week}/students/${studentNumber}`, 'put', payload)
  return result.data
}

export default {
  getInCourse,
  getSubmission,
  updateSubmission,
}
