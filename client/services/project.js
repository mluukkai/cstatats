import { callApi } from 'Utilities/apiConnection'

const getById = async (id) => {
  const result = await callApi(`/projects/${id}`)
  return result.data
}

const acceptStudent = async (id, studentId) => {
  const result = await callApi(`/projects/${id}/accept/${studentId}`, 'put')
  return result.data
}

export default {
  getById,
  acceptStudent,
}
