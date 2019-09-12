import React from 'react'
import { Button, Message } from 'semantic-ui-react'
import courseService from 'Services/course'
import { initializeCourse } from 'Utilities/redux/courseReducer'
import PeerReview from 'Components/PeerReview'
import { connect } from 'react-redux'

class Miniproject extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      form_name: '',
      form_repository: '',
      form_id: '',
      create_visible: false,
      join_visible: false
    }

    this.create = this.create.bind(this)
    this.join = this.join.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount = async () => {
    const info = await courseService.getInfoOf(this.props.course)
    this.props.store.dispatch(initializeCourse(info))
  }

  handleChange(e) {
    const value = e.target.value
    this.setState({ [e.target.name]: value })
  }

  create(e) {
    e.preventDefault()
    this.props.createProject(this.state)
  }

  join(e) {
    e.preventDefault()
    this.props.joinProject(this.state.form_id)
  }

  render() {
    if (this.props.user === null) {
      return null
    }

    const flash = () => {
      if (this.props.flash === null) {
        return null
      }
      return (
        <div style={{ paddingTop: 10 }}>
          <Message color={this.props.flash_type}>
            {this.props.flash}
          </Message>
        </div>
      )
    }

    const form = () => {
      if (!this.props.user) {
        return null
      }

      if (this.props.user.project !== null) {
        return null
      }

      if (this.props.user.projectAccepted) {
        return null
      }

      const createStyle = {
        display: this.state.createVisible ? '' : 'none'
      }

      const joinStyle = {
        display: this.state.joinVisible ? '' : 'none'
      }

      const createJoinButtonStyle = {
        display: this.state.createVisible || this.state.joinVisible ? 'none' : 'inline',
        paddingRight: 5
      }

      const okCancelStyle = {
        display: 'inline',
        paddingRight: 5
      }

      const creationDisabled = () => this.state.form_name.length < 3 || this.state.form_repository.length < 6

      return (
        <div>
          <div style={{ paddingTop: 10 }}>
            <div style={createJoinButtonStyle}>
              <Button onClick={() => this.setState({ createVisible: true })}>create miniproject</Button>
            </div>
            <div style={createJoinButtonStyle}>
              <Button onClick={() => this.setState({ joinVisible: true })}>join miniproject</Button>
            </div>
          </div>

          <div style={createStyle}>
            <h2>register a new miniproject</h2>
            <form>
              <p>
                Use this form to register a new miniproject. Each group should register yourself only once.
                Give the <em>miniproject id (that you will get after succesfull registration) to other group members so they can register themselves to the group.</em>
              </p>
              <div>
                <div style={{ display: 'inline-block', width: 150 }}>
                  name
                </div>
                <input
                  style={{ display: 'inline-block', width: 300 }}
                  type="text"
                  name="form_name"
                  value={this.state.form_name}
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <div style={{ display: 'inline-block', width: 150 }}>
                  github repository
                </div>
                <input
                  style={{ display: 'inline-block', width: 300 }}
                  type="text"
                  name="form_repository"
                  value={this.state.form_repository}
                  onChange={this.handleChange}
                />
              </div>
              <div style={{ paddingTop: 10 }}>
                <div style={okCancelStyle}>
                  <Button color='green' disabled={creationDisabled()} onClick={this.create}>register</Button>
                </div>
                <div style={okCancelStyle}>
                  <Button onClick={() => this.setState({ createVisible: false })}>cancel</Button>
                </div>
              </div>

            </form>
          </div>
          <div style={joinStyle}>
            <h2>join to a miniproject</h2>
            <p>
              Use this form to join a miniproject group that has already been registered to the system.
              You get the <em>miniproject id</em> from the group member who registered your miniproject to the system.
            </p>
            <form>
              <div>
                <div style={{ display: 'inline-block', width: 150 }}>
                  miniproject id
                </div>
                <input
                  style={{ display: 'inline-block', width: 300 }}
                  type="text"
                  name="form_id"
                  value={this.state.form_id}
                  onChange={this.handleChange}
                />
              </div>
              <div style={{ paddingTop: 10 }}>
                <div style={okCancelStyle}>
                  <Button color='green' onClick={this.join}>join</Button>
                </div>
                <div style={okCancelStyle}>
                  <Button onClick={() => this.setState({ joinVisible: false })}>cancel</Button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )
    }

    const project = () => {

      if (this.props.user.projectAccepted) {
        const style = { padding: 10 }
        return (
          <div style={style}>
            <em>projekti hyväksiluettu</em>
          </div>
        )
      }

      if (this.props.user.project === null) {
        return null
      }

      return (
        <div>
          <h2>{this.props.user.project.name}</h2>

          <div style={{ paddingTop: 4 }}>
            <strong>github</strong> <a href={this.props.user.project.github}>{this.props.user.project.github}</a>
          </div>

          <div style={{ paddingTop: 4 }}>
            <strong>meeting</strong> {this.props.user.project.meeting ?  this.props.user.project.meeting : 'not yet time assigned'}
          </div>

          <div style={{ paddingTop: 6 }}>
            <h3>members</h3>
            <ul>
              {this.props.user.project.users.map(u => {
                return (
                  <li key={u.username}>{u.last_name} {u.first_names}</li>
                )
              })}
            </ul>
          </div>

          <div>
            <strong>id</strong> {this.props.user.project._id}
          </div>
        </div>
      )
    }

    const review = () => {
      if (this.props.user.peerReview) {
        return <div style={{ paddingTop: 10 }}><em>Olet jättänyt vertaispalautteen!</em></div>
      }

      if (this.props.user.projectAccepted) {
        return null
      }

      if (this.props.user.project === null) {
        return null
      }

      return (
        <div style={{paddingTop: 10}}>
          <PeerReview
            users={this.props.user.project.users}
            createPeerReview={this.props.createPeerReview}
          />
        </div>
      )
    }

    return (
      <div>
        {form()}
        {project()}
        {review()}
      </div>  
    )
  }
}

export default Miniproject