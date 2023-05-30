import { createContext, useReducer, useContext } from 'react'

import loginService from '../services/login'
import storageService from '../services/storage'

const reducer = (state, action) => {
  if (action.type==='SET') {
    return action.payload
  }
  if (action.type==='CLEAR') {
    return null
  }
  return state
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [counter, counterDispatch] = useReducer(reducer, null)

  return (
    <UserContext.Provider value={[counter, counterDispatch] }>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const [value] = useContext(UserContext)

  return value
}

export const useLogin = () => {
  const [, dispatch] = useContext(UserContext)

  return async (credentials) => {
    const user = await loginService.login(credentials)
    dispatch({
      type: 'SET',
      payload: user
    })
    storageService.saveUser(user)
  }
}

export const useLogout = () => {
  const [, dispatch] = useContext(UserContext)

  return async () => {
    dispatch({ type: 'CLEAR' })
    storageService.removeUser()
  }
}

export const useInitUser = () => {
  const [, dispatch] = useContext(UserContext)

  return async () => {
    const user = await storageService.loadUser()
    if ( user ) {
      dispatch({
        type: 'SET',
        payload: user
      })
    }
  }
}

export default UserContext