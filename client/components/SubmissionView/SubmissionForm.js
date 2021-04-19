import React from 'react'

import {
  Form,
  Input,
  Checkbox,
  Button,
  Message,
  Segment,
} from 'semantic-ui-react'

import { connect } from 'react-redux'
import userService from 'Services/user'

import {
  setNotification,
  clearNotification,
  setError,
} from 'Utilities/redux/notificationReducer'

import { submission } from 'Utilities/redux/userReducer'

class SubmissionForm extends React.Component {
  componentWillMount() {
    this.clearForm()
  }

  setAllTo = (to) => () => {
    const state = {}
    for (let i = 1; i <= 40; i++) {
      state[`e${i}`] = to
    }
    this.setState(state)
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    const {
      setError,
      clearNotification,
      exerciseCount,
      part,
      course,
      submission: doSubmission,
      setNotification,
    } = this.props

    const { comments, hours, github, isSubmitting } = this.state

    if (isSubmitting) {
      return
    }

    this.setState({ isSubmitting: true })

    if (!this.formValid()) {
      setError('hours and github must be set')

      setTimeout(() => {
        clearNotification()
      }, 8000)

      this.setState({ isSubmitting: false })

      return
    }

    const exercises = []

    for (let i = 1; i <= exerciseCount; i++) {
      if (this.state[`e${i}`] === true) {
        exercises.push(i)
      }
    }

    const week = part

    const submission = {
      comments,
      hours,
      github,
      exercises,
      week,
    }

    const done = exercises.length
    const message = done<2
      ? `You have only ${done} exercise marked. Note that you should to check each exercise that you have completed! Are you ablosutely sure you want do do the submission?`
      : `You have marked total of ${done} exercises: ${exercises.join(', ')}. Are you sure to submit?`

    const ok = window.confirm(message)
    if (ok) {
      const result = await userService.submitExercises(submission, course)

      doSubmission(result)
      setNotification(`exercises for part ${week} submitted`)
  
      setTimeout(() => {
        clearNotification()
      }, 8000)
  
      this.clearForm()
  
      this.setState({ isSubmitting: false })
    } else {
      this.setState({ isSubmitting: false })
    }

  }

  handleChange = (e) => {
    const value = e.target.name[0] === 'e' ? e.target.checked : e.target.value
    this.setState({ [e.target.name]: value })
  }

  formValid() {
    const { hours, github } = this.state

    return (
      hours > 0 &&
      github.length > 24 &&
      github.indexOf('https://github.com/') === 0 &&
      github.indexOf('https://github.com/username/repo') === -1
    )
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

  render() {
    const { exerciseCount, part, coursePartCount } = this.props
    const { visible, plagiarism, isSubmitting } = this.state

    const canCreateNextPartSubmission = part < coursePartCount

    if (exerciseCount === 0) {
      return (
        <Message>Submitting exercises for part {part} not yet possible</Message>
      )
    }

    if (visible === false && canCreateNextPartSubmission) {
      return (
        <Button fluid onClick={() => this.setState({ visible: true })}>
          Create submission for part {part}
        </Button>
      )
    }

    if (visible && plagiarism === false) {
      return (
        <Segment>
          <p>
            Kurssilla seurataan Helsingin yliopiston opintokäytäntöjä.
            Plagiarismi ja opintovilppi, eli esimerkiksi netissä olevien tai
            kaverilta saatujen vastausten kopiointi ja niiden palauttaminen
            omana työnä on kiellettyä. Todettu opintovilppi johtaa
            kurssisuorituksen hylkäämiseen ja toistuva opintovilppi voi johtaa
            opinto-oikeuden määräaikaiseen menettämiseen. Lue lisää osoitteessa{' '}
            <a href="https://guide.student.helsinki.fi/fi/artikkeli/mita-ovat-vilppi-ja-plagiointi">
              https://guide.student.helsinki.fi/fi/artikkeli/mita-ovat-vilppi-ja-plagiointi
            </a>
          </p>
          <p>
            Plagiarism, such as copying answers from the web or from a friend,
            and returning them as one's own work is prohibited. Read more{' '}
            <a href="https://guide.student.helsinki.fi/en/article/what-cheating-and-plagiarism">
              https://guide.student.helsinki.fi/en/article/what-cheating-and-plagiarism
            </a>
          </p>

          <Form>
            <Form.Field>
              <Checkbox
                onClick={() => this.setState({ plagiarism: true })}
                label="I have read the above and agree not to present other people's code as my own solutions. Olen lukenut ja ymmärtänyt ylläolevan opintovilppiin liittyvän tekstin ja tiedän opintovilpin seuraukset. En aio esittää muiden vastauksia omina vastauksinani."
              />
            </Form.Field>
          </Form>
        </Segment>
      )
    }

    const exercises = () => {
      const c = []
      for (let i = 1; i <= this.props.exerciseCount; i++) {
        c.push(i)
      }

      const checks = c.map((i) => (
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

      return <div style={{ marginBottom: 10 }}>{checks}</div>
    }

    return canCreateNextPartSubmission ? (
      <div>
        <h3>
          Create a submission for part
          {this.props.part}
        </h3>
        <p>
          <strong>Mark exercises you have done</strong> &nbsp; &nbsp;
          <Button size="tiny" onClick={this.setAllTo(true)}>
            mark all
          </Button>
          <Button size="tiny" onClick={this.setAllTo(false)}>
            clear all
          </Button>
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
          <p>
            Pressing send will submit this whole part. Any exercises you have
            not marked done above for this part can <b>not</b> be marked done
            later. If you by accident submit the wrong number of exercises
            contact the course teacher or telegram admins.
          </p>
          <Button disabled={isSubmitting} primary>
            Send
          </Button>
          <Button onClick={() => this.setState({ visible: false })}>
            Cancel
          </Button>
        </Form>
      </div>
    ) : null
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

  const submissionForCourse = user.submissions.filter(
    (s) => s.courseName === course.info.name,
  )

  const extensionForCourse = user.extensions
    ? user.extensions.find(
        (e) => e.to === course.info.name || e.courseName === course.info.name,
      )
    : null

  const extendSubmissions = extensionForCourse
    ? extensionForCourse.extendsWith
    : []

  const max = Math.max(
    -1,
    ...submissionForCourse.map((s) => s.week),
    ...extendSubmissions.map((s) => s.part),
  )

  const { week } = course.info

  let part = max + 1

  if (part < week) {
    part = week
  }

  return {
    user,
    exerciseCount: course.info.exercises[part],
    part,
    coursePartCount: course.info.exercises ? course.info.exercises.length : 0,
    course: course.info.name,
  }
}

export default connect(mapStateToProps, {
  setNotification,
  clearNotification,
  setError,
  submission,
})(SubmissionForm)
