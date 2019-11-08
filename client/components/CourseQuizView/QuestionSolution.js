import React from 'react'
import { multipleChoiceOptionChosen } from 'Utilities/common'
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
          const answered = multipleChoiceOptionChosen(previousAnswers, option.text)

          const checkedOption = (answered && (answered.chosenValue === undefined || answered.chosenValue === null)) || (answered && answered.chosenValue === true)
          const right = (option.right === !!checkedOption) || false
          const wrong = (option.right !== !!checkedOption) || false
          const border = right ? 'solid limegreen' : (wrong ? 'solid red' : null)
          const opacity = (!wrong && !right) ? 0.5 : 1
          const style = { border, opacity, borderRadius: '5px' }
          return (
            <Form.Field style={{ opacity: 0.9 }} key={option.text} disabled>
              <label style={{ opacity: 0.9 }} >{option.text}</label>
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
