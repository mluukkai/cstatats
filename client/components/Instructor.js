import React from 'react'
import { Button, Icon, Table } from 'semantic-ui-react'
import { getAxios } from 'Utilities/apiConnection'

const PeerReviewStat = ({ review, users }) => {
  if (review.type === 'text') {
    return (
      <div style={{ paddingTop: 10 }}>
        <h6>{review.title}</h6>
        <div>
          {users.map((u) => {
            if (!review.answers[u.username]) {
              return null
            }
            return (
              <div key={u.username} style={{ paddingBottom: 10 }}>
                <div>
                  <em>
                    {u.last_name}
                    {' '}
                    {u.first_names}
:
                  </em>
                </div>
                <div>
                  {review.answers[u.username]}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const by = (whom, answers) => {
    const answer = answers.find(a => a.by === whom)

    return answer !== undefined ? answer.score : ''
  }

  const average = (answers, user) => {
    const noMe = Object.values(answers[user]).filter(a => a.by !== user)
    const result = 1.0 * noMe.reduce((s, a) => s + Number(a.score), 0) / (noMe.length)
    return result.toFixed(1)
  }

  return (
    <div style={{ paddingTop: 10 }}>
      <h6>{review.title}</h6>
      <Table>
        <thead>
          <tr>
            <th />
            {users.map(u => (
              <th key={u.username}>
                {u.last_name}
              </th>
            ))}
            <th>
              avg
            </th>
          </tr>
        </thead>
        {users.map(u => (
          <tbody>
            <tr>
              <td>
                {u.last_name}
                {' '}
                {u.first_names}
              </td>
              {users.map(reviewer => (
                <td
                  key={reviewer.username}
                  style={{ fontStyle: reviewer.username === u.username ? 'italic' : '' }}
                >
                  {by(reviewer.username, review.answers[u.username])}
                </td>
              ))}
              <td>
                {average(review.answers, u.username)}
              </td>
            </tr>
          </tbody>
        ))}
      </Table>
    </div>
  )
}

class PeerReviewStats extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
    }
  }

  render() {
    const { peerReviews, peerReviewsGiven } = this.props.project

    if (peerReviewsGiven === 0) {
      return (
        <div>
          no peer reviews given
        </div>
      )
    }

    return (
      <div>
        <Button
          style={{ display: this.state.visible ? 'none' : '' }}
          onClick={() => this.setState({ visible: true })}
        >
          show given
          {' '}
          {peerReviewsGiven}
          {' '}
peer reviews
        </Button>
        <div style={{ display: this.state.visible ? '' : 'none' }}>
          <h5>Peer revirews</h5>
          <div>
            {peerReviews.map((p, i) => <PeerReviewStat key={i} review={p} users={this.props.project.users} />)}
          </div>
          <Button onClick={() => this.setState({ visible: false })}>
            hide peer reviews
          </Button>
        </div>
      </div>
    )
  }
}

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
    const user = JSON.parse(localStorage.getItem('currentFSUser'))
    const config = {
      headers: { 'x-access-token': user.token },
    }
    getAxios.get(`/${this.props.course}/projects`, config)
      .then((response) => {
        const data = response.data.sort(this.byName)

        this.setState({ projects: data })
      }).catch((error) => {
        console.log(error)
      })
  }

  componentWillReceiveProps(nextProps) {
    const user = JSON.parse(localStorage.getItem('currentFSUser'))
    const config = {
      headers: { 'x-access-token': user.token },
    }

    getAxios.get(`/${this.props.course}/projects`, config)
      .then((response) => {
        this.setState({ projects: response.data.sort(this.byName) })
      }).catch((error) => {
        console.log(error)
      })
  }

  setTime(id, time) {
    const user = JSON.parse(localStorage.getItem('currentFSUser'))
    const config = {
      headers: { 'x-access-token': user.token },
    }
    getAxios.post(`/projects/${id}/meeting`, { meeting: time }, config)
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
    const user = JSON.parse(localStorage.getItem('currentFSUser'))
    const config = {
      headers: { 'x-access-token': user.token },
    }
    getAxios.delete(`/projects/${id}/meeting`, config)
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
    const user = JSON.parse(localStorage.getItem('currentFSUser'))
    const config = {
      headers: { 'x-access-token': user.token },
    }
    getAxios.post(`/projects/${id}/instructor`, { instructor }, config)
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
    const user = JSON.parse(localStorage.getItem('currentFSUser'))
    const config = {
      headers: { 'x-access-token': user.token },
    }
    getAxios.delete(`/projects/${id}/instructor`, config)
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

export default Instructor
