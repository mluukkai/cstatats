import { callApi } from 'Utilities/apiConnection'

const getAllForCourse = async (courseName) => {
  try {
    const url = `/admins/course/${courseName}`
    const result = await callApi(url)
    return result.data
  } catch (ex) {
    console.log(ex)
  }
}

const suotarMangel = async (data, courseName) => {
  const result = await callApi(`/admins/mangel/${courseName}`, 'post', data)
  return result.data
}

export default {
  getAllForCourse,
  suotarMangel,
}
