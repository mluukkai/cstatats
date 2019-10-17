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

export default {
  getAllForCourse,
}
