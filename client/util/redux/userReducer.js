const reducer = (state = null, action) => {
  if (action.type === 'LOGIN') {
    return action.payload
  } else if (action.type === 'LOGOUT') {
    return null
  } else if (action.type === 'SUBMISSION') {
    return action.payload
  } else if (action.type === 'PROJECT') {
    return action.payload
  } else if (action.type === 'REVIEW') {
    return action.payload
  }

  return state
}

export const login = (user) => {
  return {
    type: 'LOGIN',
    payload: user
  }
}

export const setProject = (user) => {
  return {
    type: 'PROJECT',
    payload: user
  }
}

export const setPeerReview = (user) => {
  return {
    type: 'REVIEW',
    payload: user
  }
}



export const submission = (data) => {
  return {
    type: 'SUBMISSION',
    payload: data
  }
}

export const logout = () => {
  return {
    type: 'LOGOUT'
  }
}

export default reducer