import React from 'react'
import {
  Form, Input, Checkbox, Button, Message, Segment,
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import userService from 'Services/user'
import { setNotification, clearNotification, setError } from 'Utilities/redux/notificationReducer'
import { submission } from 'Utilities/redux/userReducer'

class SubmissionForm extends React.Component {
  componentWillMount() {
    this.clearForm()
  }

  clearForm() {
    const state = {
      hours: '',
      github: 'https://github.com/username/repo',
      comments: '',
      visible: false,
      plagiarism: false,
    }

    for (let i = 1; i <= 40; i++) {
      state[`e${i}`] = false
    }
    this.setState(state)
  }

  setAllTo = to => () => {
    const state = {}
    for (let i = 1; i <= 40; i++) {
      state[`e${i}`] = to
    }
    this.setState(state)
  }

  formValid() {
    return (
      this.state.hours > 0
      && this.state.github.length > 24
      && this.state.github.indexOf('https://github.com/') === 0
      && this.state.github.indexOf('https://github.com/username/repo') === -1
    )
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    if (!this.formValid()) {
      this.props.setError('hours and github must be set')
      setTimeout(() => {
        this.props.clearNotification()
      }, 8000)
      return
    }

    const exercises = []
    for (let i = 1; i <= this.props.exerciseCount; i++) {
      if (this.state[`e${i}`] === true) {
        exercises.push(i)
      }
    }

    const week = this.props.part

    const submission = {
      comments: this.state.comments,
      hours: this.state.hours,
      github: this.state.github,
      exercises,
      week,
    }

    const result = await userService.submitExercises(submission, this.props.course)
    this.props.submission(result)
    this.props.setNotification(`exercises for part ${week} submitted`)
    setTimeout(() => {
      this.props.clearNotification()
    }, 8000)
    this.clearForm()
  }

  handleChange = (e) => {
    const value = e.target.name[0] === 'e' ? e.target.checked : e.target.value
    this.setState({ [e.target.name]: value })
  }

  render() {
    const { user } = this.props

    if (this.props.exerciseCount === 0) {
      return (
        <Message>
          Submitting exercises for part
          {' '}
          {this.props.part}
          {' '}
not yet possible
        </Message>
      )
    }

    if (this.state.visible === false) {
      return (
        <Button
          fluid
          onClick={() => this.setState({ visible: true })}
        >
          Create submission for part
          {' '}
          {this.props.part}
        </Button>
      )
    }

    if (this.state.visible && this.state.plagiarism === false) {
      return (
        <Segment>
          <p>
            Kurssilla seurataan Helsingin yliopiston opintokäytäntöjä. Plagiarismi ja opintovilppi, eli esimerkiksi netissä olevien tai kaverilta saatujen vastausten kopiointi ja niiden palauttaminen omana työnä on kiellettyä.
          </p>
          <p>
            Todettu opintovilppi johtaa kurssisuorituksen hylkäämiseen ja toistuva opintovilppi voi johtaa opinto-oikeuden määräaikaiseen menettämiseen.
            Lue lisää osoitteesta
            {' '}
            <a href="http://blogs.helsinki.fi/alakopsaa/opiskelijalle/">http://blogs.helsinki.fi/alakopsaa/opiskelijalle/</a>
          </p>

          <Form>
            <Form.Field>
              <Checkbox onClick={() => this.setState({ plagiarism: true })} label="Olen lukenut ja ymmärtänyt ylläolevan opintovilppiin liittyvän tekstin ja tiedän opintovilpin seuraukset. En aio esittää muiden vastauksia omina vastauksinani." />
            </Form.Field>
          </Form>
        </Segment>
      )
    }

    const exercises = () => {
      const c = []
      for (let i = 1; i <= this.props.exerciseCount; i++) { c.push(i) }

      const checks = c.map(i => (
        <span key={i}>
          <span style={{ padding: 4 }}>{i}</span>
          <input
            type="checkbox"
            style={{ padding: 2 }}
            onChange={this.handleChange}
            checked={this.state[`e${i}`]}
            value={this.state[`e${i}`]}
            name={`e${i}`}
          />
        </span>
      ))

      return (
        <div style={{ marginBottom: 10 }}>
          {checks}
        </div>
      )
    }

    return (
      <div>
        <h3>
Create a submission for part
          {this.props.part}
        </h3>
        <p>
          <strong>Mark exercises you have done</strong>
          {' '}
&nbsp; &nbsp;
          <Button size="tiny" onClick={this.setAllTo(true)}>mark all</Button>
          <Button size="tiny" onClick={this.setAllTo(false)}>clear all</Button>
        </p>
        <Form onSubmit={this.handleSubmit}>
          {exercises()}
          <Form.Field inline>
            <label>Hours</label>
            <Input
              type="number"
              value={this.state.hours}
              name="hours"
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Github</label>
            <Input
              value={this.state.github}
              name="github"
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Comments</label>
            <Form.TextArea
              value={this.state.comments}
              name="comments"
              onChange={this.handleChange}
            />
          </Form.Field>
          <Button primary>Send</Button>
          <Button onClick={() => this.setState({ visible: false })}>Cancel</Button>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = ({ user, course }) => {
  if (!user || !course.info) {
    return {
      exerciseCount: 0,
      part: 0,
      username: null,
    }
  }

  const submissionForCourse = user.submissions.filter(s => s.courseName === course.info.name)

  const extensionForCourse = user.extensions ? user.extensions.find(e => e.to === course.info.name) : null
  const extendSubmissions = extensionForCourse ? extensionForCourse.extendsWith : []

  const max = Math.max(-1, ...submissionForCourse.map(s => s.week), ...extendSubmissions.map(s => s.part))

  const week = course.info.week
  let part = max + 1
  if (part < week) {
    part = week
  }

  return {
    user: user,
    exerciseCount: course.info.exercises[part],
    part,
    course: course.info.name,
  }
}

export default connect(
  mapStateToProps,
  {
    setNotification, clearNotification, setError, submission,
  },
)(SubmissionForm)
