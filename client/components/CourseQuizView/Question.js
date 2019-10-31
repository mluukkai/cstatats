import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Segment, Icon, Transition } from 'semantic-ui-react'
import { getUserAction } from 'Utilities/redux/userReducer'
import quizService from 'Services/quiz'

const Question = ({ question, previousAnswers, locked }) => {
  const dispatch = useDispatch()
  const [answers, setAnswers] = useState(previousAnswers)
  const [displaySync, setDisplaySync] = useState(false)
  const [status, setStatus] = useState('green') // Status by color

  const setOption = (option, chosenValue) => async () => {
    const withoutOption = answers.filter(a => a.text !== option.text)
    const newAnswers = [...withoutOption, { ...option, chosenValue }]
    setDisplaySync(true)
    setStatus('yellow')
    try {
      await quizService.submitAnswer(question.id, newAnswers)
      setAnswers(newAnswers)
      dispatch(getUserAction())
      setTimeout(() => setStatus('green'), 500)
      setTimeout(() => setDisplaySync(false), 1000)
    } catch {
      setStatus('red')
    }
  }
  const message = {
    yellow: 'Saving',
    green: 'Saved',
    red: 'Saving failed, try again',
  }
  return (
    <Segment>
      <h3>
        {question.title}
        {displaySync && (
          <Transition visible={status !== 'green'} animation="pulse">
            <div style={{ float: 'right' }}>
              <Icon name="sync" color={status} />
              <span>{message[status]}</span>
            </div>
          </Transition>
        )}
      </h3>
      <p>{question.desc}</p>
      <Form>
        {question.options.map((option) => {
          const answered = answers.find(a => a.text === option.text)
          const checkedOption = (answered && answered.chosenValue === undefined) || (answered && answered.chosenValue === true)
          return (
            <Form.Field key={option.text} disabled={locked === true}>
              <label>{option.text}</label>
              <Form.Radio onClick={setOption(option, true)} checked={checkedOption === true} label="Kyllä" />
              <Form.Radio onClick={setOption(option, false)} checked={checkedOption === false} label="Ei" />
            </Form.Field>
          )
        })}
      </Form>
    </Segment>
  )
}

export default Question
