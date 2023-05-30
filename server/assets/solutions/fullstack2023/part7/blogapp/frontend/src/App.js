import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom'

import LoginForm from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import Togglable from './components/Togglable'

import { useNotification, useInitialization, useClearUser } from './hooks/index'

import { SmallButton, Page, Navigation } from './components/styled'

const App = () => {

  const blogFormRef = useRef()
  const stateInitializer = useInitialization()
  const notifyWith = useNotification()

  const clearUser = useClearUser()

  const user = useSelector(({ user }) => user)

  useEffect(() => {
    stateInitializer()
  }, [])

  const logout = async () => {
    clearUser()
    notifyWith('logged out')
  }

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  const padding = {
    padding: 5
  }

  return (
    <Page>

      <Navigation>
        <span style={padding}><strong>Blog app</strong></span>
        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        <span style={padding}>{user.name} logged in</span>
        <span style={padding}>
          <SmallButton onClick={logout}>logout</SmallButton>
        </span>
      </Navigation>

      <Notification />

      <Routes>
        <Route path="/users" element={ <Users />}></Route>
        <Route path="/users/:id" element={ <User />}></Route>
        <Route path="/blogs/:id" element={ <Blog />}></Route>
        <Route path="/" element={ <Blogs />}></Route>
      </Routes>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlog hideMe={() => blogFormRef.current.toggleVisibility()} />
      </Togglable>
    </Page>
  )
}

export default App
