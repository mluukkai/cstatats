import { callApi } from 'Utilities/apiConnection'

const getById = async (id) => {
  const result = await callApi(`/projects/${id}`)
  return result.data
}

const acceptStudent = async (studentId) => {
  const result = await callApi(`/projects/accept/${studentId}`, 'put')
  return result.data
}

const resetProject = async (studentId) => {
  const result = await callApi(`/projects/reset/${studentId}`, 'put')
  return result.data
}


export default {
  getById,
  acceptStudent,
  resetProject
}
