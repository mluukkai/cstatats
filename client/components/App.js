import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Container } from 'semantic-ui-react'
import userService from 'Services/user'
import { getUserAction } from 'Utilities/redux/userReducer'
import LogInAsBar from 'Components/LogInAsBar'
import NavBar from 'Components/NavBar'
import Notification from 'Components/Notification'
import AppRouter from 'Components/AppRouter'

const App = ({ getUser, user }) => {
  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (!user) return
    userService.getSubmissions(user)
  }, [user])

  useEffect(() => {
    setInterval(() => {
      getUser()
    }, 60 * 1000) // One minute
  }, [])

  if (!user) return null

  return (
    <Container>
      <LogInAsBar />
      <NavBar />
      <Notification />
      <AppRouter />
    </Container>
  )
}

const mapStateToProps = ({ user, course }) => ({ user, course })

const mapDispatchToProps = { getUser: getUserAction }

export default connect(mapStateToProps, mapDispatchToProps)(App)
