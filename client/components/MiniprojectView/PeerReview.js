import React from 'react'
import { Button } from 'semantic-ui-react'
import { callApi } from 'Utilities/apiConnection'

class PeerReview extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      questions: [],
      answers: {},
      formVisible: false,
    }

    this.create = this.create.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onRadioChange = this.onRadioChange.bind(this)
  }

  componentWillMount() {
    callApi('/course/questions')
      .then((response) => {
        const questions = response.data
        const answers = {}
        questions.forEach((q) => {
          if (q.type === 'rating') {
            answers[q.id] = {}
          } else {
            answers[q.id] = ''
          }
        })
        this.setState({ questions: response.data, answers })
      }).catch((response) => {
        console.log(response)
      })
  }

  onRadioChange(data) {
    const { question, target, value } = data
    const answers = Object.assign({}, this.state.answers)
    const answer = Object.assign({}, this.state.answers[question])
    answer[target] = value
    answers[question] = answer

    this.setState({ answers })
  }

  onChange(e) {
    const question = e.target.name
    const answers = Object.assign({}, this.state.answers)
    answers[question] = e.target.value
    this.setState({ answers })
  }

  create() {
    const notAnswered = () => {
      const answerMissing = this.state.questions.map((q) => {
        if (q.type === 'rating') {
          const answers = Object.keys(this.state.answers[q.id]).length
          return answers < this.props.users.length
        }
        return this.state.answers[q.id].length === 0
      })

      return false // answerMissing.some(f => f === true)
    }

    if (notAnswered()) {
      alert('All questions are not answered...')
    } else {
      this.props.createPeerReview(this.state.answers)
    }
  }

  render() {
    const notAnswered = () => {
      const answerMissing = this.state.questions.map((q) => {
        if (q.type === 'rating') {
          const answers = Object.keys(this.state.answers[q.id]).length
          return answers < this.props.users.length
        }
        return this.state.answers[q.id].length === 0
      })

      return answerMissing.some(f => f === true)
    }

    return (
      <div>
        <Button
          onClick={() => this.setState({ formVisible: true })}
          style={{ display: this.state.formVisible ? 'none' : '' }}
        >
          Create peer review
        </Button>
        <div style={{ paddingTop: 10, display: this.state.formVisible ? '' : 'none' }}>
          <h4>Peer review</h4>
          {this.state.questions.map(q => (
            <Question
              key={q.id}
              onChange={this.onChange}
              onRadioChange={this.onRadioChange}
              users={this.props.users}
              question={q}
            />
          ))}
          <div style={{ paddingTop: 20 }}>
            <span style={{ paddingRight: 10 }}>
              <Button
                color={notAnswered() ? 'grey' : 'blue'}
                onClick={this.create}
              >
                create
              </Button>
            </span>
            <Button onClick={() => this.setState({ formVisible: false })}>cancel</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default PeerReview
