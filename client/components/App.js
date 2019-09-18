import React from 'react'
import { connect } from 'react-redux'
import { Menu, Container } from 'semantic-ui-react'
import Notification from 'Components/Notification'
import Instructor from 'Components/Instructor'
import courseService from 'Services/course'
import userService from 'Services/user'
import { initializeCourse, initializeStats } from 'Utilities/redux/courseReducer'
import { clearNotification, setNotification } from 'Utilities/redux/notificationReducer'
import {
  logout, setProject, setPeerReview, getUserAction,
} from 'Utilities/redux/userReducer'
import { Route } from 'react-router-dom'
import Submissions from 'Components/Submissions'
import Course from 'Components/Course'
import Courses from 'Components/Courses'
import Solutions from 'Components/Solutions'
import Crediting from 'Components/Crediting'
import Miniproject from 'Components/Miniproject'
import { getAxios } from 'Utilities/apiConnection'

class App extends React.Component {
  state = {

  }

  componentDidMount = async () => {
    this.props.getUser()
    await userService.getSubmissions()
  }

  handleItemClick = history => (e, { name }) => {
    const course = this.props.course.info.name
    if (name === 'submissions') {
      history.push(`/${course}/submissions`)
    } else if (name === 'miniproject') {
      history.push(`/${course}/miniproject`)
    } else if (name === 'crediting') {
      history.push(`/${course}/crediting`)
    } else if (name === 'instructor') {
      history.push(`/${course}/instructor`)
    } else {
      history.push(`/${course}`)
    }

    this.setState({ activeItem: name })
  }

  logout = history => () => {
    this.props.logout()
    history.push('/')
    this.props.setNotification('logged out')
    setTimeout(() => {
      this.props.clearNotification()
    }, 8000)
  }

  loggedInCourse() {
    const url = document.location.href
    const h = url.indexOf('#')
    return h != -1 && url.substring(h).length > 2 && !(this.props.user === null)
  }

  miniprojectEnabled() {
    const course = this.props.course.info
    return course && course.miniproject
  }

  creditingEnabled() {
    const course = this.props.course.info
    return course && course.extension
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
    getAxios.post(`/${course}/projects`, project)
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
    const user = JSON.parse(localStorage.getItem('currentFSUser'))

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
    const name = this.props.user
      ? `${this.props.user.first_names} ${this.props.user.last_name}`
      : ''

    const { activeItem } = this.state

    const instructor = () => this.props.user && ['laatopi', 'mluukkai', 'kalleilv', 'nikoniko'].includes(this.props.store.getState().user.username)

    return (
      <Container>

        <Route
          path="/"
          render={({ history, match }) => (

            <Menu>
              <Menu.Item
                name="stats"
                active={activeItem === 'stats'}
                onClick={this.handleItemClick(history)}
              >
                course stats
              </Menu.Item>
              <Menu.Item
                name="stats"
                active={activeItem === 'stats'}
                onClick={this.handleItemClick(history)}
              >
                {this.props.user && this.props.user.username + ' '}
                {this.props.user && this.props.user.first_names + ' '}
                {this.props.user && this.props.user.last_name}
              </Menu.Item>

              {this.loggedInCourse()
                && (
                  <Menu.Item
                    name="submissions"
                    active={activeItem === 'submissions'}
                    onClick={this.handleItemClick(history)}
                  >
                    my submissions
              </Menu.Item>
                )
              }

              {this.loggedInCourse() && this.creditingEnabled()
                && (
                  <Menu.Item
                    name="crediting"
                    active={activeItem === 'crediting'}
                    onClick={this.handleItemClick(history)}
                  >
                    crediting
              </Menu.Item>
                )
              }

              {this.loggedInCourse() && this.miniprojectEnabled()
                && (
                  <Menu.Item
                    name="miniproject"
                    active={activeItem === 'miniproject'}
                    onClick={this.handleItemClick(history)}
                  >
                    miniproject
                  </Menu.Item>
                )
              }

              {this.loggedInCourse() && this.miniprojectEnabled() && instructor()
                && (
                  <Menu.Item
                    name="instructor"
                    active={activeItem === 'instructor'}
                    onClick={this.handleItemClick(history)}
                  >
                    instructor
                  </Menu.Item>
                )
              }
              {this.props.user
                && (
                  <>
                    <Menu.Item
                      name="name"
                    >
                      <em>
                        {name}
                      </em>
                    </Menu.Item>
                    <Menu.Item
                      name="logout"
                      onClick={this.logout(history)}
                    >
                      logout
                    </Menu.Item>
                  </>
                )
              }
            </Menu>
          )}
        />

        <Notification />

        <Route
          exact
          path="/"
          render={({ history }) => <Courses historyy={history} />}
        />

        <Route
          exact
          path="/:course"
          render={({ history, match }) => <Course history={history} course={match.params.course} store={this.props.store} />}
        />

        <Route
          exact
          path="/:course/submissions"
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
          path="/:course/crediting"
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
          path="/:course/solutions/:id"
          render={({ match }) => <Solutions id={match.params.id} course={match.params.course} />}
        />

        <Route
          path="/:course/miniproject"
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
          path="/:course/instructor"
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
  logout,
  setNotification,
  clearNotification,
  setProject,
  setPeerReview,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
