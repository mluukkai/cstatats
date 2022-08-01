import { callApi } from 'Utilities/apiConnection'

const getInCourse = async (courseName) => {
  const result = await callApi(`/students/course/${courseName}/`)
  return result.data
}

const getInCourseSimple = async (courseName) => {
  const result = await callApi(`/students/course/${courseName}/simple`)
  return result.data
}

const getCompletedInCourse = async (courseName) => {
  const result = await callApi(`/students/course/${courseName}/completed`)
  return result.data
}

const getSubmission = async (courseName, week, username) => {
  const result = await callApi(
    `/submissions/course/${courseName}/week/${week}/students/${username}`,
  )
  return result.data
}

const getSubmissions = async (courseName, username) => {
  const result = await callApi(
    `/submissions/course/${courseName}/students/${username}`,
  )
  return result.data
}

const updateSubmission = async (courseName, week, username, payload) => {
  const result = await callApi(
    `/submissions/course/${courseName}/week/${week}/students/${username}`,
    'put',
    payload,
  )
  return result.data
}

const deleteSubmission = async (courseName, week, username) => {
  const result = await callApi(
    `/submissions/course/${courseName}/week/${week}/students/${username}`,
    'delete',
  )
  return result.data
}

const updateStudentCourseProgress = async (username, courseProgress) => {
  const result = await callApi(
    `/students/${username}/progress`,
    'put',
    courseProgress,
  )
  return result.data
}

const updateStudentsCourseProgress = async (data) => {
  const result = await callApi(`/progress`, 'post', data)
  return result.data
}

export default {
  updateStudentsCourseProgress,
  getInCourse,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  updateStudentCourseProgress,
  getCompletedInCourse,
  getInCourseSimple,
  getSubmissions,
}
