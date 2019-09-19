import { callApi } from 'Utilities/apiConnection'

const getSubmissions = async (user) => {
  const response = await callApi(`/users/${user.username}`)
  return response.data
}

const submitExercises = async (exercises, course, user) => {
  const response = await callApi(`/courses/${course}/users/${user.username}/exercises`, 'post', exercises)
  return response.data
}

const createMiniproject = async (project, course) => {
  const response = await callApi(`/courses/${course}/projects`, 'post', project)
  return response.data
}

export default {
  getSubmissions, submitExercises, createMiniproject,
}
