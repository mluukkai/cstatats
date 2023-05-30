import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Routes, Route, Link } from 'react-router-dom'

import Blogs from './components/Blogs'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'

import { Navigation, Page, NavButton, Footer } from './components'

import userService from './services/user'

import { setNotification } from './reducers/notification'
import { initializeBlogs } from './reducers/blogs'
import { initializeUsers } from './reducers/users'
import { logoutUser, loginUser } from './reducers/user'

const App = () => {
  const blogFormRef = useRef()

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [])

  useEffect(() => {
    const userFromStorage = userService.getUser()
    if (userFromStorage) {
      dispatch(loginUser(userFromStorage))
    }
  }, [])

  const logout = () => {
    userService.clearUser()
    dispatch(logoutUser())
    dispatch(setNotification({ message: 'good bye!', type: 'info' }))
  }

  if (user === null) {
    return (
      <Page>
        <Notification />
        <LoginForm />
      </Page>
    )
  }

  const padding = {
    padding: 5,
  }

  return (
    <Page>
      <Navigation>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        <span style={{ paddingLeft: 5, paddingRight: 5 }}>
          {user.name} logged in
        </span>
        <NavButton onClick={logout}>logout</NavButton>
      </Navigation>

      <Notification />

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlogForm togglableRef={blogFormRef} />
      </Togglable>

      <Routes>
        <Route path="/" element={<Blogs />} />
      </Routes>
      <Routes>
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
      <Routes>
        <Route path="/users" element={<Users />} />
      </Routes>
      <Routes>
        <Route path="/users/:id" element={<User />} />
      </Routes>

      <Footer>Full stack open, app form part 7</Footer>
    </Page>
  )
}

export default App
