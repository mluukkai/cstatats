import { callApi } from 'Utilities/apiConnection'

const getInCourse = async (courseName) => {
  const result = await callApi(`/students/course/${courseName}/`)
  return result.data
}

const getCompletedInCourse = async (courseName) => {
  const result = await callApi(`/students/course/${courseName}/completed`)
  return result.data
}

const getSubmission = async (courseName, week, username) => {
  const result = await callApi(`/submissions/course/${courseName}/week/${week}/students/${username}`)
  return result.data
}

const updateSubmission = async (courseName, week, username, payload) => {
  const result = await callApi(`/submissions/course/${courseName}/week/${week}/students/${username}`, 'put', payload)
  return result.data
}

const updateStudentCourseProgress = async (username, courseProgress) => {
  const result = await callApi(`/students/${username}/progress`, 'put', courseProgress)
  return result.data
}

export default {
  getInCourse,
  getSubmission,
  updateSubmission,
  updateStudentCourseProgress,
  getCompletedInCourse,
}
