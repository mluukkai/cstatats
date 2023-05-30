import { createContext, useReducer, useContext } from 'react'

const emptyNotification = { message: null }

const reducer = (state, action) => {
  if (action.type==='SET') {
    return action.payload
  }
  if (action.type==='CLEAR') {
    return emptyNotification
  }
  return state
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [counter, counterDispatch] = useReducer(reducer, emptyNotification)

  return (
    <NotificationContext.Provider value={[counter, counterDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const [value] = useContext(NotificationContext)

  return value
}

export const useNotifier = () => {
  const [, dispatch] = useContext(NotificationContext)

  return (message, type='info')  => {
    dispatch({
      type: 'SET',
      payload: { message, type }
    })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }
}

export default NotificationContext