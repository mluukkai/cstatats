import React, { useState, useEffect } from 'react'
import { Form, Segment, Icon, Transition } from 'semantic-ui-react'
import { shuffle } from 'Utilities/common'
import quizService from 'Services/quiz'

const Question = ({ question, previousAnswers, locked }) => {
  const [answers, setAnswers] = useState(previousAnswers)
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [displaySync, setDisplaySync] = useState(false)
  const [status, setStatus] = useState('green') // Status by color

  useEffect(() => {
    setShuffledOptions(shuffle(question.options))
  }, [question.options.length])

  const toggleOption = (option, checked) => async () => {
    const newAnswers = checked ? answers.filter(a => a.text !== option.text) : [...answers, option]
    setDisplaySync(true)
    setStatus('yellow')
    try {
      await quizService.submitAnswer(question.id, newAnswers)
      setAnswers(newAnswers)
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
        {shuffledOptions.map((option) => {
          const checked = !!answers.find(a => a.text === option.text)
          return (
            <Form.Field key={option.text} disabled={locked === true}>
              <Form.Checkbox onClick={toggleOption(option, checked)} checked={checked} label={option.text} />
            </Form.Field>
          )
        })}
      </Form>
    </Segment>
  )
}

export default Question
