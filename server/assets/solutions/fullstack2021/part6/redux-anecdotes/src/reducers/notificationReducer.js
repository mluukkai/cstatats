const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    case 'CLEAR_NOTIFICATION':
      return null
    default: 
      return state
  }
}

let timeoutId = null

export const setNotification = (notification, time) => {
  return dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification
    })

    if ( timeoutId ) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION'
      })
    }, time * 1000)
  }
}

export default reducer