import { callApi } from 'Utilities/apiConnection'

const getById = async (id) => {
  const result = await callApi(`/questions/${id}`)
  return result.data
}

const getByCourse = async (courseName, partNumber) => {
  const result = await callApi(`/questions/course/${courseName}/part/${partNumber}`)
  return result.data
}

const lockQuiz = async (courseName, partName) => {
  const result = await callApi(`/questions/course/${courseName}/part/${partName}/lock`, 'post')
  return result.data
}

const submitAnswer = async (id, payload) => {
  const result = await callApi(`/questions/${id}/answer`, 'post', payload)
  return result.data
}

const getOpenQuizzes = async (courseName) => {
  const result = await callApi(`/questions/course/${courseName}/show`)
  return result.data
}

export default {
  getById,
  getByCourse,
  getOpenQuizzes,
  submitAnswer,
  lockQuiz,
}
