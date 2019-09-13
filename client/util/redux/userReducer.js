const reducer = (state = null, action) => {
  if (action.type === 'LOGIN') {
    return action.payload
  } if (action.type === 'LOGOUT') {
    return null
  } if (action.type === 'SUBMISSION') {
    return action.payload
  } if (action.type === 'PROJECT') {
    return action.payload
  } if (action.type === 'REVIEW') {
    return action.payload
  }

  return state
}

export const login = user => ({
  type: 'LOGIN',
  payload: user,
})

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

export const logout = () => ({
  type: 'LOGOUT',
})

export default reducer
