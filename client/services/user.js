import { callApi } from 'Utilities/apiConnection'

const getSubmissions = async (username) => {
  const user = JSON.parse(localStorage.getItem('currentFSUser'))

  const response = await callApi(`/users/${user.username}`)
  return response.data
}

const submitExercises = async (exercises, course) => {
  const user = JSON.parse(localStorage.getItem('currentFSUser'))

  const response = await callApi(`/${course}/users/${user.username}/exercises`, 'post', exercises)
  return response.data
}

const createMiniproject = async (project, course) => {
  const response = await callApi(`/${course}/projects`, 'post', project)
  return response.data
}

export default {
  getSubmissions, submitExercises, createMiniproject,
}
