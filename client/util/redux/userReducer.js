import createAction from 'Utilities/apiConnection'

const reducer = (state = null, action) => {
  if (action.type === 'GET_USER_SUCCESS') {
    return action.response
  } if (action.type === 'LOGOUT_SUCCESS') {
    window.location = action.response.logoutUrl || '/'
    return null
  } if (action.type === 'SUBMISSION') {
    return {
      ...state,
      ...action.payload,
    }
  } if (action.type === 'PROJECT') {
    return action.payload
  } if (action.type === 'REVIEW') {
    return action.payload
  }

  return state
}

export const getUserAction = () => createAction('/login', 'GET_USER', 'post')

export const setProject = user => ({
  type: 'PROJECT',
  payload: user,
})

export const setPeerReview = user => ({
  type: 'REVIEW',
  payload: user,
})


export const submission = data => ({
  type: 'SUBMISSION',
  payload: data,
})

export const logout = () => createAction('/logout', 'LOGOUT', 'delete', { returnUrl: window.location.origin })

export const createExtension = (courseName, extension) => createAction(`/courses/${courseName}/extensions`, 'CREATE_EXTENSION', 'post', extension)

export default reducer
