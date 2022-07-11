/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/button-has-type */
import React from 'react'
import { Icon } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'

const Marker = ({ examOn, wasRight }) => {
  if (examOn) return null

  return wasRight ? (
    <Icon name="checkmark" color="green" />
  ) : (
    <Icon name="delete" color="red" />
  )
}

const Selection = ({ i, selection, doAnswer, checked, correct, examOn }) => {
  const alpha = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const style = {
    margin: 10,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
  }

  let wasRight = false
  if (correct) {
    if (checked === correct.includes(i)) {
      wasRight = true
    }
  }

  const selectionContent =
    typeof selection.text === 'string'
      ? selection.text
      : selection.text.join('\n')

  return (
    <div style={style}>
      <div>
        <input
          type="checkbox"
          style={{ marginRight: 10 }}
          onChange={doAnswer}
          checked={checked}
        />
        {alpha[i]}
        {'.'}
        <Marker
          style={{ marginLeft: 10 }}
          examOn={examOn}
          wasRight={wasRight}
        />
      </div>
      <ReactMarkdown>{selectionContent}</ReactMarkdown>
    </div>
  )
}

const Question = ({ question, lang, doAnswer, answers, examOn }) => {
  const style = {
    borderWidth: 2,
    borderStyle: 'solid',
    padding: 5,
    paddingTop: 20,
    paddingLeft: 20,
    margin: 10,
    marginBottom: 30,
  }

  const body = question.question[lang].body.join('\n')

  return (
    <div style={style}>
      <h4>{question.question[lang].title}</h4>
      <ReactMarkdown>{body}</ReactMarkdown>
      <div>
        {question.selections[lang].map((s) => (
          <Selection
            key={s.id}
            selection={s}
            i={s.id}
            doAnswer={doAnswer(question.id, s.id)}
            checked={answers.includes(s.id)}
            examOn={examOn}
            correct={question.correct}
          />
        ))}
      </div>
    </div>
  )
}

export default Question
