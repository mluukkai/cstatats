import React from 'react'
import { connect } from 'react-redux'
import { Container } from 'semantic-ui-react'
import Notification from 'Components/Notification'
import Instructor from 'Components/Instructor'
import courseService from 'Services/course'
import userService from 'Services/user'
import { initializeCourse, initializeStats } from 'Utilities/redux/courseReducer'
import { clearNotification, setNotification } from 'Utilities/redux/notificationReducer'
import {
  setProject, setPeerReview, getUserAction,
} from 'Utilities/redux/userReducer'
import { Route } from 'react-router-dom'
import { getAxios } from 'Utilities/apiConnection'
import Submissions from 'Components/Submissions'
import Course from 'Components/Course'
import Courses from 'Components/Courses'
import Solutions from 'Components/Solutions'
import Crediting from 'Components/Crediting'
import Miniproject from 'Components/Miniproject'
import AdminView from 'Components/AdminView'
import NavBar from './NavBar'

class App extends React.Component {
  state = { }

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

  joinProject = (id) => {
    getAxios.post(`/projects/${id}`, {})
      .then((response) => {
        const user = Object.assign({}, this.props.user, { project: response.data })
        this.props.setProject(user)
        this.props.setNotification(`you have joined to ${user.project.name}`)
        setTimeout(() => {
          this.props.clearNotification()
        }, 8000)
      }).catch((error) => {
        this.props.setNotification(error.response.data.error)
        setTimeout(() => {
          this.props.clearNotification()
        }, 8000)
      })
  }

  createProject = (project) => {
    project.user = this.props.user

    const course = this.props.course.info.name
    getAxios.post(`/courses/${course}/projects`, project)
      .then((response) => {
        const user = Object.assign({}, this.props.user, { project: response.data })
        this.props.setProject(user)
        this.props.setNotification('miniproject created!')
        setTimeout(() => {
          this.props.clearNotification()
        }, 8000)
      }).catch((error) => {
        this.props.setNotification(error.response.data.error)
        setTimeout(() => {
          this.props.clearNotification()
        }, 8000)
      })
  }

  createPeerReview = (answers) => {
    const { user } = this.props

    getAxios.post(`/users/${user.username}/peer_review`, answers)
      .then((response) => {
        const user = Object.assign({}, this.props.user, { peerReview: response.data })
        this.props.setPeerReview(user)
        this.props.setNotification('peer review created')
        setTimeout(() => {
          this.props.clearNotification()
        }, 8000)
      }).catch((response) => {
        console.log(response)
      })
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
            <Submissions
              history={history}
              course={match.params.course}
              store={this.props.store}
            />
          )}
        />

        <Route
          exact
          path="/courses/:course/crediting"
          render={({ history, match }) => (
            <Crediting
              history={history}
              course={match.params.course}
              store={this.props.store}
              createCrediting={this.createCrediting}
              user={this.props.user}
            />
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
            <Miniproject
              createProject={this.createProject}
              joinProject={this.joinProject}
              user={this.props.user}
              createPeerReview={this.createPeerReview}
              course={match.params.course}
              store={this.props.store}
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

const mapDispatchToProps = {
  getUser: getUserAction,
  setNotification,
  clearNotification,
  setProject,
  setPeerReview,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
