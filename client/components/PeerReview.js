import React from 'react'
import { Button } from 'semantic-ui-react'
import { getAxios } from 'Utilities/apiConnection'

class Question extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    const [question, target] = e.target.name.split(' ')
    const value = e.target.value

    this.props.onRadioChange({ question, target, value })
  }

  render() {
    const q = this.props.question

    const questionStyle = {
      paddingTop: 5,
      paddingLeft: 5,
      paddingBottom: 5,
      borderStyle: 'solid',
      marginTop: 10,
      borderWidth: 1,
      borderRadius: 5,
    }

    if (q.type === 'rating') {
      const nameStyle = { display: 'inline-block', width: 300 }
      const radioStyle = { width: 50 }
      return (
        <div style={questionStyle}>
          <div>
            <strong>
              {q.title}
            </strong>
          </div>
          <div style={{ paddingTop: 2 }}>
            <em>
              {q.description}
            </em>
          </div>
          <div style={{ paddingTop: 2 }}>
            {q.scale}
          </div>
          <table>
            <tbody>
              <tr>
                <td />
                <td>0</td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
              </tr>
              {this.props.users.map(u => (
                <tr key={u.username}>
                  <td style={nameStyle}>
                    {u.last_name}
                    {' '}
                    {u.first_names}
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="0" />
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="1" />
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="2" />
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="3" />
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="4" />
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    if (q.type === 'inline') {
      const style = { display: 'inline-block', width: 200, paddingLeft: 5 }
      return (
        <div style={questionStyle}>
          <div style={style}>
            <strong>
              {q.title}
            </strong>
          </div>
          <div style={style}>
            <input
              onChange={this.props.onChange}
              name={q.id}
            />
          </div>
        </div>
      )
    }

    return (
      <div style={questionStyle}>
        <strong>
          {q.title}
        </strong>
        <div>
          <em>
            {q.description}
          </em>
        </div>
        <div>
          <textarea
            style={{ width: '99%', height: 200 }}
            onChange={this.props.onChange}
            name={q.id}
          />
        </div>
      </div>
    )
  }
}

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
    getAxios.get('/course/questions')
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
