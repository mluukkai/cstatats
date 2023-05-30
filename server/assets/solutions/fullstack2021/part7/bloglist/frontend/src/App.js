import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import Container from '@material-ui/core/Container'

import Notification from './components/Notification'
import Togglable from './components/Togglable'
import NewBlog from './components/NewBlog'
import Bloglist from './components/Bloglist'
import Blog from './components/Blog'
import Login from './components/Login'
import Users from './components/Users'
import User from './components/User'
import Navigation from './components/Navigation'

import { setUser } from './reducers/user'
import { initializeUsers } from './reducers/users'
import { initializeBlogs } from './reducers/blogs'

const App = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const blogFormRef = React.createRef()

  useEffect(() => {
    dispatch(setUser())
    dispatch(initializeUsers())
    dispatch(initializeBlogs())
  }, [])

  if ( !user ) {
    return (
      <Container>
        <h2>login to application</h2>

        <Notification />
        <Login />

      </Container>
    )
  }

  return (
    <Container>
      <Navigation />
      <Notification />

      <Switch>
        <Route path="/users/:id">
          <User />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/blogs/:id">
          <Blog />
        </Route>
        <Route path="/">
          <Togglable buttonLabel='create new blog' ref={blogFormRef} >
            <NewBlog hideComponent={() => blogFormRef.current.toggleVisibility()} />
          </Togglable>
          <Bloglist />
        </Route>
      </Switch>
    </Container>
  )
}

export default App