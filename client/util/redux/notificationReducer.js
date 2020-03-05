const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    case 'CREATE_EXTENSION_SUCCESS':
      return { type: 'success', text: 'Crediting done!' }
    case 'CREATE_EXTENSION_FAILURE':
      return { type: 'error', text: 'Failed to create extension!' }
    default:
      return state
  }
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
