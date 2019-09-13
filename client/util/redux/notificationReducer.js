const reducer = (state = null, action) => {
  if (action.type === 'SET') {
    return action.payload
  } if (action.type === 'CLEAR') {
    return null
  }

  return state
}

export const setLoginError = text => ({
  type: 'SET',
  payload: {
    text,
    type: 'loginError',
  },
})

export const setError = text => ({
  type: 'SET',
  payload: {
    text,
    type: 'error',
  },
})

export const setNotification = text => ({
  type: 'SET',
  payload: {
    text,
    type: 'success',
  },
})

export const clearNotification = () => ({
  type: 'CLEAR',
})

export default reducer
