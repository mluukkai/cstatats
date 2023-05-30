import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notification'
import blogReducer from './reducers/blogs'
import userReducer from './reducers/user'
import usersReducer from './reducers/users'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    users: usersReducer,
  },
})

export default store
