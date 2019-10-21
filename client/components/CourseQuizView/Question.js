import React, { useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { shuffle } from 'Utilities/common'
import quizService from 'Services/quiz'

const Question = ({
  question, previousAnswers, pendingAnswers, setPendingAnswers, submitAnswers,
}) => {
  if (!question || !question.options) return null
  const [answers, setAnswers] = useState(previousAnswers)

  const submitAnswer = () => {
    quizService.submitAnswer(question.id, answers)
  }

  const toggleOption = (option, checked) => () => {
    const newAnswers = checked ? answers.filter(a => a.text !== option.text) : [...answers, option]
    setAnswers(newAnswers)

    if (!setPendingAnswers) return

    setPendingAnswers({ ...pendingAnswers, [question.id]: newAnswers })
  }

  const submitButton = submitAnswers ? <Button onClick={submitAnswer}> Submit </Button> : null
  return (
    <Segment>
      <h3>{question.title}</h3>
      <p>{question.desc}</p>
      <Form>
        {shuffle(question.options).map((option) => {
          const checked = !!answers.find(a => a.text === option.text)
          return (
            <Form.Field key={option.text}>
              <Form.Checkbox onClick={toggleOption(option, checked)} checked={checked} label={option.text} />
            </Form.Field>
          )
        })}
        {submitButton}
      </Form>
    </Segment>
  )
}

export default Question
