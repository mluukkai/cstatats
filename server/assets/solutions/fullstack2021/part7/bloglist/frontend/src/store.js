import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import notificationReducer from './reducers/notification'
import blogsReducer from './reducers/blogs'
import userReducer from './reducers/user'
import usersReducer from './reducers/users'

const reducer = combineReducers({
  notification: notificationReducer,
  blogs: blogsReducer,
  user: userReducer,
  users: usersReducer
})

export default createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)