import React from 'react'
import { Form, Segment } from 'semantic-ui-react'

const QuestionSolution = ({ question, previousAnswers }) => {
  return (
    <Segment>
      <h3>
        {question.title}
      </h3>
      <p>{question.desc}</p>
      <Form>
        {question.options.map((option) => {
          const answered = previousAnswers.find(a => a.text === option.text)
          const checkedOption = (answered && answered.chosenValue === undefined) || (answered && answered.chosenValue === true)
          const right = (option.right === checkedOption) || false
          const wrong = (option.right !== checkedOption) || false
          const border = right ? 'solid limegreen' : (wrong ? 'solid red' : null)
          const opacity = (!wrong && !right) ? 0.5 : 1
          const style = { border, opacity, borderRadius: '5px' }
          return (
            <Form.Field key={option.text} disabled>
              <label>{option.text}</label>
              <Form.Radio style={(option.right && style) || {}} checked={checkedOption === true} label="Kyllä" />
              <Form.Radio style={(!option.right && style) || {}} checked={checkedOption !== true} label="Ei" />
            </Form.Field>
          )
        })}
      </Form>
    </Segment>
  )
}

export default QuestionSolution
