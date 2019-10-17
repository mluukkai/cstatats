import React from 'react'
import { connect } from 'react-redux'
import { Container } from 'semantic-ui-react'
import Notification from 'Components/Notification'
import userService from 'Services/user'
import { getUserAction } from 'Utilities/redux/userReducer'
import { Route } from 'react-router-dom'
import CourseRouter from 'Components/CourseRouter'
import Courses from 'Components/Courses'
import AdminView from 'Components/AdminView'
import NavBar from './NavBar'

class App extends React.Component {
  state = {}

  componentDidMount = async () => {
    this.props.getUser()
  }

  static getDerivedStateFromProps = (newProps) => {
    if (!newProps.user) return {}
    userService.getSubmissions(newProps.user)
    return {}
  }

  render() {
    return (
      <Container>
        <NavBar />
        <Notification />

        <Route exact path="/" component={Courses} />
        <Route path="/luukkainen" exact component={AdminView} />
        <Route path="/courses/:course" component={CourseRouter} />
      </Container>
    )
  }
}

const mapStateToProps = ({ user, course }) => ({ user, course })

const mapDispatchToProps = { getUser: getUserAction }

export default connect(mapStateToProps, mapDispatchToProps)(App)
