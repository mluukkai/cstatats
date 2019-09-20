import { callApi } from 'Utilities/apiConnection'

const getInfoOf = async (name) => {
  try {
    const url = `/courses/${name}/info`
    const result = await callApi(url)
    return result.data
  } catch (ex) {
    console.log(ex)
  }
}

const getStatsOf = async (name) => {
  try {
    const url = `/courses/${name}/stats`
    const result = await callApi(url)
    return result.data
  } catch (ex) {
    console.log(ex)
  }
}

const getCourses = async () => {
  try {
    const url = '/courses'
    const result = await callApi(url)
    return result.data
  } catch (ex) {
    console.log(ex)
  }
}

const getSolutions = async (course, id) => {
  try {
    const url = `/courses/${course}/solution_files/${id}`
    const result = await callApi(url)
    return result.data
  } catch (ex) {
    console.log(ex)
  }
}

const getFile = async (url) => {
  try {
    const result = await callApi(url)
    return {
      data: result.data,
      content: result.headers['content-type'],
    }
  } catch (ex) {
    console.log(ex)
  }
}

const create = async ({ name, url, term, year, enabled, exercises }) => {
  const result = await callApi('/courses', 'post', { name, url, term, year, enabled, exercises })
  return result.data
}

const toggleCourse = async (courseName) => {
  const result = await callApi(`/courses/${courseName}/toggle`, 'post')
  return result.data
}

const update = async (courseName, updatedFieldsObject) => {
  const result = await callApi(`/courses/${courseName}`, 'put', updatedFieldsObject)
  return result.data
}

export default {
  create, update, toggleCourse, getStatsOf, getSolutions, getFile, getInfoOf, getCourses,
}
