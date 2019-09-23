import React from 'react'
import { connect } from 'react-redux'
import { Container } from 'semantic-ui-react'
import Notification from 'Components/Notification'
import Instructor from 'Components/Instructor'
import userService from 'Services/user'
import { getUserAction } from 'Utilities/redux/userReducer'
import { Route } from 'react-router-dom'
import SubmissionView from 'Components/SubmissionView'
import Course from 'Components/Course'
import Courses from 'Components/Courses'
import Solutions from 'Components/Solutions'
import Crediting from 'Components/Crediting'
import MiniprojectView from 'Components/MiniprojectView'
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

  toggledUser() {
    if (!this.props.user) return false

    const username = this.props.user.username
    return ['mluukkai', 'testertester', 'vvvirola', 'laitilat', 'vpekkine'].includes(username)
  }

  render() {
    return (
      <Container>
        <NavBar />
        <Notification />

        <Route exact path="/" component={Courses} />
        <Route path="/luukkainen" exact component={AdminView} />

        <Route
          exact
          path="/courses/:course"
          render={({ match }) => <Course courseName={match.params.course} />}
        />

        <Route
          exact
          path="/courses/:course/submissions"
          render={({ history, match }) => (
            <SubmissionView
              history={history}
              courseName={match.params.course}
            />
          )}
        />

        <Route
          exact
          path="/courses/:course/crediting"
          render={({ match }) => (
            <Crediting courseName={match.params.course} />
          )}
        />

        <Route
          path="/courses/:course/solutions/:id"
          render={({ match }) => <Solutions id={match.params.id} course={match.params.course} />}
        />

        <Route
          path="/courses/:course/miniproject"
          exact
          render={({ match }) => (
            <MiniprojectView
              user={this.props.user}
              courseName={match.params.course}
            />
          )}
        />

        <Route
          path="/courses/:course/instructor"
          exact
          render={({ match }) => (
            <Instructor
              user={this.props.user}
              course={match.params.course}
            />
          )}
        />
      </Container>
    )
  }
}

const mapStateToProps = ({ user, course }) => ({ user, course })

const mapDispatchToProps = { getUser: getUserAction }

export default connect(mapStateToProps, mapDispatchToProps)(App)
