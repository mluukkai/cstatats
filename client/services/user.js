import { getAxios } from 'Utilities/apiConnection'

const login = async (username, password) => {
  const response = await getAxios.post('/login', { username, password })
  return response.data
}

const getSubmissions = async (username) => {
  const user = JSON.parse(localStorage.getItem('currentFSUser'))

  const config = {
    headers: { 'x-access-token': user.token },
  }

  const response = await getAxios.get(`/users/${user.username}`, config)
  return response.data
}

const submitExercises = async (exercises, course) => {
  const user = JSON.parse(localStorage.getItem('currentFSUser'))
  const config = {
    headers: { 'x-access-token': user.token },
  }

  const response = await getAxios.post(`/${course}/users/${user.username}/exercises`, exercises, config)
  return response.data
}

const createMiniproject = async (project, course) => {
  const user = JSON.parse(localStorage.getItem('currentFSUser'))
  const config = {
    headers: { 'x-access-token': user.token },
  }

  const response = await getAxios.post(`/${course}/projects`, project, config)
  return response.data
}

export default {
  login, getSubmissions, submitExercises, createMiniproject,
}
