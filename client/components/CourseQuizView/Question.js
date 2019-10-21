import React, { useState, useEffect } from 'react'
import { Form, Segment, Icon, Transition } from 'semantic-ui-react'
import { shuffle } from 'Utilities/common'
import quizService from 'Services/quiz'

const Question = ({ question, previousAnswers }) => {
  const [answers, setAnswers] = useState(previousAnswers)
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [status, setStatus] = useState('green') // Status by color

  useEffect(() => {
    setShuffledOptions(shuffle(question.options))
  }, [question.options.length])

  const toggleOption = (option, checked) => async () => {
    const newAnswers = checked ? answers.filter(a => a.text !== option.text) : [...answers, option]
    setStatus('yellow')
    try {
      await quizService.submitAnswer(question.id, newAnswers)
      setAnswers(newAnswers)
      setTimeout(() => setStatus('green'), 300)
    } catch {
      setStatus('red')
    }
  }

  return (
    <Segment>
      <h3>
        <Transition visible={status !== 'yellow'} animation="pulse" duration="700">
          <Icon name="sync" color={status} />
        </Transition>
        {question.title}
      </h3>
      <p>{question.desc}</p>
      <Form>
        {shuffledOptions.map((option) => {
          const checked = !!answers.find(a => a.text === option.text)
          return (
            <Form.Field key={option.text}>
              <Form.Checkbox onClick={toggleOption(option, checked)} checked={checked} label={option.text} />
            </Form.Field>
          )
        })}
      </Form>
    </Segment>
  )
}

export default Question
