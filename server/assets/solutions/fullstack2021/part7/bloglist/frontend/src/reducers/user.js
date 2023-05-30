import loginService from '../services/login'
import storage from '../utils/storage'
import { setNotification } from './notification'

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN_USER':
    return action.data
  case 'LOGOUT_USER':
    return null
  default:
    return state
  }
}

export const login = (credentials) => {
  return async dispatch => {
    try {
      const data = await loginService.login(credentials)
      storage.saveUser(data)
      dispatch(setNotification(`${data.name} welcome back!`))
      dispatch({
        type: 'LOGIN_USER',
        data
      })
    } catch(e) {
      dispatch(setNotification('wrong username/password', 'error'))
    }
  }
}

export const setUser = () => {
  const user = storage.loadUser()
  if (user) {
    return async dispatch => {
      dispatch({
        type: 'LOGIN_USER',
        data: user
      })
    }
  }
}

export const logout = () => {
  return async dispatch => {
    storage.logoutUser()
    dispatch(setNotification('bye for now...'))
    dispatch({
      type: 'LOGOUT_USER'
    })
  }
}


export default reducer