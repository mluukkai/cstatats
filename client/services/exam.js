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

export default {
  getQuestions,
  setAnswers,
  startExam,
  getExam,
  endExam,
  getExamStatus,
}
