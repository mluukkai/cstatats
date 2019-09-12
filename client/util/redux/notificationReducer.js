const reducer = (state = null, action) => {
  if (action.type === 'SET') {
    return action.payload
  } else if (action.type === 'CLEAR') {
    return null
  }

  return state
}

export const setLoginError = (text) => {
  return {
    type: 'SET',
    payload: {
      text, 
      type: 'loginError'
    }
  }
}

export const setError = (text) => {
  return {
    type: 'SET',
    payload: {
      text,
      type: 'error'
    }
  }
}

export const setNotification = (text) => {
  return {
    type: 'SET',
    payload: {
      text,
      type: 'success'
    }
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR'
  }
}

export default reducer