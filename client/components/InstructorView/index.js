import React from 'react'
import { connect } from 'react-redux'
import { callApi } from 'Utilities/apiConnection'
import Project from 'Components/InstructorView/Project'

class Instructor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      projects: [],
      showOwn: false,
    }

    this.check = this.check.bind(this)
    this.setTime = this.setTime.bind(this)
    this.deleteTime = this.deleteTime.bind(this)
    this.setInstructor = this.setInstructor.bind(this)
    this.deleteInstructor = this.deleteInstructor.bind(this)
  }

  byName(p1, p2) {
    return p1.name < p2.name ? -1 : 1
  }

  componentWillMount() {
    callApi(`/courses/${this.props.course.info.name}/projects`)
      .then((response) => {
        const data = response.data.sort(this.byName)

        this.setState({ projects: data })
      }).catch((error) => {
        console.log(error)
      })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    callApi(`/courses/${this.props.course.info.name}/projects`)
      .then((response) => {
        this.setState({ projects: response.data.sort(this.byName) })
      }).catch((error) => {
        console.log(error)
      })
  }

  setTime(id, time) {
    callApi(`/projects/${id}/meeting`, 'post', { meeting: time })
      .then((response) => {
        const projects = this.state.projects.filter(p => p._id !== id)
        const changed = this.state.projects.filter(p => p._id === id)[0]
        changed.meeting = response.data.meeting
        this.setState({ projects: projects.concat(changed).sort(this.byName) })
      }).catch((error) => {
        console.log(error)
      })
  }

  deleteTime(id) {
    callApi(`/projects/${id}/meeting`, 'delete')
      .then((response) => {
        const projects = this.state.projects.filter(p => p._id !== id)
        const changed = this.state.projects.filter(p => p._id === id)[0]
        changed.meeting = null
        this.setState({ projects: projects.concat(changed).sort(this.byName) })
      }).catch((error) => {
        console.log(error)
      })
  }

  setInstructor(id, instructor) {
    callApi(`/projects/${id}/instructor`, 'post', { instructor })
      .then((response) => {
        const projects = this.state.projects.filter(p => p._id !== id)
        const changed = this.state.projects.filter(p => p._id === id)[0]
        changed.instructor = response.data.instructor
        this.setState({ projects: projects.concat(changed).sort(this.byName) })
      }).catch((error) => {
        console.log(error)
      })
  }

  deleteInstructor(id) {
    callApi(`/projects/${id}/instructor`, 'delete')
      .then((response) => {
        const projects = this.state.projects.filter(p => p._id !== id)
        const changed = this.state.projects.filter(p => p._id === id)[0]
        changed.instructor = null
        this.setState({ projects: projects.concat(changed).sort(this.byName) })
      }).catch((error) => {
        console.log(error)
      })
  }

  check(e) {
    this.setState({ showOwn: e.target.checked })
  }

  render() {
    const projects = this.state.showOwn ? this.state.projects.filter(p => p.instructor === this.props.user.username) : this.state.projects
    return (
      <div>
        <div>
          show only own projects
          {' '}
          <input type="checkbox" onChange={this.check} />
        </div>
        {projects.map(p => (
          <Project
            key={p._id}
            project={p}
            setTime={this.setTime}
            deleteTime={this.deleteTime}
            setInstructor={this.setInstructor}
            deleteInstructor={this.deleteInstructor}
          />
        ))}
      </div>
    )
  }
}

const mapStateToProps = ({ user, course }) => ({ user, course })

export default connect(mapStateToProps)(Instructor)
