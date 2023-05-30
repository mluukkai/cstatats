import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button,
  Toolbar,
  AppBar
} from '@material-ui/core'

import { logout } from '../reducers/user'

const Navigation = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <em>
          {user.name} logged in
        </em>
        <Button color="inherit" onClick={handleLogout}>logout</Button>
      </Toolbar>
    </AppBar>

  )
}

export default Navigation
/*
    <div style={nav}>
      <Link style={padding} to="/">blogs</Link>
      <Link style={padding} to="/users">users</Link>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </div>
*/