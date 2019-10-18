import { callApi } from 'Utilities/apiConnection'

const getInCourse = async (courseName) => {
  const result = await callApi(`/students/course/${courseName}/`)
  return result.data
}

export default {
  getInCourse,
}
