import { callApi } from 'Utilities/apiConnection'

const getQuestions = async () => {
  try {
    const url = '/exams'
    const result = await callApi(url)
    return result.data
  } catch (ex) {
    console.log(ex)
  }
}

const setAnswers = async (studentId, payload) => {
  const result = await callApi(`/exams/${studentId}`, 'put', payload)

  return result.data
}

const startExam = async (studentId) => {
  const result = await callApi(`/exams/${studentId}`, 'post')
  return result.data
}

const getExam = async (studentId) => {
  const result = await callApi(`/exams/${studentId}`)
  return result.data
}

const endExam = async (studentId) => {
  const result = await callApi(`/exams/${studentId}`, 'delete')
  return result.data
}

const getExamStatus = async (studentId) => {
  const result = await callApi(`/exams/${studentId}/status`)
  return result.data
}

const isBeta = async (studentId) => {
  const result = await callApi(`/exams/${studentId}/beta`)
  return result.data
}

const getAll = async () => {
  const result = await callApi(`/exams`)
  return result.data
}

const getMoodle = async () => {
  const result = await callApi(`/moodle_exams`)
  return result.data
}

const resetExam = async (studentId) => {
  const result = await callApi(`/exams/${studentId}/reset`, 'post')
  return result.data
}

const getExceptions = async () => {
  const result = await callApi(`/exam_exceptions`)
  return result.data
}

const createException = async (payload) => {
  const result = await callApi(`/exam_exceptions`, 'post', payload)
  return result.data
}

const deleteException = async (id) => {
  const result = await callApi(`/exam_exceptions/${id}`, 'delete')
  return result.data
}

export default {
  getQuestions,
  setAnswers,
  startExam,
  getExam,
  endExam,
  getExamStatus,
  getAll,
  getMoodle,
  resetExam,
  getExceptions,
  createException,
  deleteException,
  isBeta,
}
