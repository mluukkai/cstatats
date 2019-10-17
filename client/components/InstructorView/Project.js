import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import PeerReviewStats from 'Components/InstructorView/PeerReviewStats'

class Project extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      formVisible: false,
      instructorFormVisible: false,
      time: '',
      instructor: '',
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onDeleteTime = this.onDeleteTime.bind(this)
    this.onDeleteInstructor = this.onDeleteInstructor.bind(this)
    this.onInstructorSubmit = this.onInstructorSubmit.bind(this)
    this.onInstructorChange = this.onInstructorChange.bind(this)
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.setTime(this.props.project._id, this.state.time)
  }

  onInstructorSubmit(e) {
    e.preventDefault()
    this.props.setInstructor(this.props.project._id, this.state.instructor)
  }

  onInstructorChange(e) {
    e.preventDefault()
    this.setState({ instructor: e.target.value })
  }

  onDeleteTime() {
    const ok = confirm('are you sure?')
    if (ok) {
      this.props.deleteTime(this.props.project._id)
    }
  }

  onDeleteInstructor() {
    const ok = confirm('are you sure?')
    if (ok) {
      this.props.deleteInstructor(this.props.project._id)
    }
  }

  onChange(e) {
    e.preventDefault()
    this.setState({ time: e.target.value })
  }

  onDeleteTime() {
    const ok = confirm('are you sure?')
    if (ok) {
      this.props.deleteTime(this.props.project._id)
    }
  }

  render() {
    const { project } = this.props

    const instructor = () => {
      const options = ['laatopi', 'mluukkai', 'kalleilv', 'nikoniko']
      const buttonStyle = {
        display: this.state.instructorFormVisible ? 'none' : '',
      }

      const formStyle = {
        display: this.state.instructorFormVisible ? '' : 'none',
      }

      if (project.instructor) {
        return (
          <span>
            <strong>instructor</strong>
            {' '}
            {project.instructor}
            <span
              onClick={this.onDeleteInstructor}
            >
              <Icon name="trash" />
            </span>
          </span>
        )
      }

      return (
        <div>
          <div style={buttonStyle}>
            <Button onClick={() => this.setState({ instructorFormVisible: true })}>set instructor</Button>
          </div>
          <div style={formStyle}>
            <form onSubmit={this.onInstructorSubmit}>
              <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                <select name="instructor" onChange={this.onInstructorChange}>
                  <option>--</option>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <Button
                color="success"
                disabled={this.state.instructor.length < 3}
              >
                set instructor
              </Button>
              <span style={{ paddingLeft: 5 }}>
                <Button onClick={() => this.setState({ instructorFormVisible: false })}>cancel</Button>
              </span>
            </form>
          </div>
        </div>
      )
    }

    const meeting = () => {
      const buttonStyle = {
        display: this.state.formVisible ? 'none' : '',
      }

      const formStyle = {
        display: this.state.formVisible ? '' : 'none',
      }

      if (!project.meeting) {
        return (
          <div>
            <div style={buttonStyle}>
              <Button onClick={() => this.setState({ formVisible: true })}>set time for meeting</Button>
            </div>
            <div style={formStyle}>
              <form onSubmit={this.onSubmit}>
                <div style={{ paddingBottom: 5 }}>
                  <input
                    onChange={this.onChange}
                    placeholder="eg. ti 10.30 A340"
                    name="time"
                    value={this.state.time}
                  />
                </div>
                <Button
                  color="success"
                  disabled={this.state.time.length < 5}
                >
                  set time
                </Button>
                <span style={{ paddingLeft: 5 }}>
                  <Button onClick={() => this.setState({ formVisible: false })}>cancel</Button>
                </span>
              </form>
            </div>
          </div>
        )
      }

      return (
        <span>
          <strong>meetings</strong>
          {' '}
          {project.meeting}
          <span
            onClick={this.onDeleteTime}
          >
            <Icon name="trash" />
          </span>
        </span>
      )
    }

    const style = { paddingTop: 10 }
    const smallPadding = { paddingTop: 5 }

    return (
      <div style={style}>
        <div className="ui divider" />
        <h4>{project.name}</h4>
        <div style={smallPadding}>
          <em>
            <strong>id</strong>
            {' '}
            {project._id}
          </em>
        </div>
        <div style={smallPadding}>
          <a href={project.github}>{project.github}</a>
        </div>
        <div style={smallPadding}>
          {meeting()}
        </div>
        <div style={smallPadding}>
          {instructor()}
        </div>

        <div style={style}>
          <h5>Students</h5>
          <ul style={style}>
            {project.users.map((u, i) => (
              <li key={i}>
                {u.last_name}
                {' '}
                {u.first_names}
                {' '}
                <a href={`https://github.com/${u.github}`}>{u.github}</a>
              </li>
            ))}
          </ul>
        </div>
        <PeerReviewStats project={project} />
      </div>
    )
  }
}

export default Project
