import { useEffect, useRef } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Blogs from './components/Blogs'
import Blog from './components/Blog'
import LoginForm from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'

import { useNotifier } from './contexts/notification'
import { useUser, useInitUser, useLogout } from './contexts/user'

import { SmallButton, Page, Navigation } from './components/styled'

const App = () => {

  const blogFormRef = useRef()

  const notifyWith = useNotifier()
  const initUser = useInitUser()
  const logout = useLogout()

  useEffect(() => {
    initUser()
  }, [])

  const handleLogout = async () => {
    logout()
    notifyWith('logged out')
  }

  const user = useUser()

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
      <h2>blog service</h2>
      <Navigation>
        <span style={padding}><strong>Blog app</strong></span>
        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        <span style={padding}>{user.name} logged in</span>
        <span style={padding}>
          <SmallButton onClick={handleLogout}>logout</SmallButton>
        </span>
      </Navigation>

      <Notification />

      <Routes>
        <Route path="/users" element={ <Users />}></Route>
        <Route path="/users/:id" element={ <User />}></Route>
        <Route path="/blogs/:id" element={ <Blog />}></Route>
        <Route path="/" element={ <Blogs />}></Route>
      </Routes>

      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <NewBlog hideMe={() => blogFormRef.current.toggleVisibility()} />
      </Togglable>

    </Page>
  )
}

export default App