import { combineReducers } from 'redux'

import course from 'Utilities/redux/courseReducer'
import notification from 'Utilities/redux/notificationReducer'
import user from 'Utilities/redux/userReducer'

export default combineReducers({
  course,
  notification,
  user,
})
