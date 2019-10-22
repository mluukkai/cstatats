import React from 'react'
import { Form, Segment } from 'semantic-ui-react'

const QuestionSolution = ({ question, previousAnswers, locked }) => {
  return (
    <Segment>
      <h3>
        {question.title}
      </h3>
      <p>{question.desc}</p>
      <Form>
        {question.options.map((option) => {
          const answered = previousAnswers.find(a => a.text === option.text)
          const checked = !!answered
          const right = option.right === true || (answered && answered.right === true) || false
          const wrong = (answered && answered.right === false) || false
          const border = right ? 'solid limegreen' : (wrong ? 'solid red' : null)
          const opacity = (!wrong && !right) ? 0.5 : 1
          return (
            <Form.Field key={option.text} disabled={locked === true}>
              <Form.Checkbox style={{ border, opacity, borderRadius: '5px' }} checked={checked} label={option.text} />
            </Form.Field>
          )
        })}
      </Form>
    </Segment>
  )
}

export default QuestionSolution
