import { callApi } from 'Utilities/apiConnection'

const getById = async (id) => {
  const result = await callApi(`/questions/${id}`)
  return result.data
}

const getByCourse = async (courseName, partNumber) => {
  const result = await callApi(`/questions/course/${courseName}/part/${partNumber}`)
  return result.data
}

const submitQuiz = async (payload) => {
  const result = await callApi('/questions/answers', 'post', payload)
  return result
}

const submitAnswer = async (id, payload) => {
  const result = await callApi(`/questions/${id}/answer`, 'post', payload)
  return result.data
}

export default {
  getById,
  getByCourse,
  submitAnswer,
  submitQuiz,
}
