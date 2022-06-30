import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import examService from 'Services/exam'

const Marker = ({ examOn, wasRight }) => {
  if (examOn) return null

  return wasRight ? (
    <Icon name="checkmark" color="green" />
  ) : (
    <Icon name="delete" color="red" />
  )
}

const Selection = ({ i, selection, doAnswer, checked, correct, examOn }) => {
  const alpha = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g']
  const style = {
    margin: 10,
  }

  let wasRight = false
  if (correct) {
    if (checked === correct.includes(i)) {
      wasRight = true
    }
  }

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
      {selection.text}
    </div>
  )
}

const Question = ({ question, lang, doAnswer, answers, examOn }) => {
  const style = {
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 5,
    margin: 10,
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

const Exam = () => {
  const [questions, setQuestions] = useState(null)
  const [answers, setAnswers] = useState(null)
  const [examOn, setExamOn] = useState(true)
  const { user } = useSelector(({ user, course }) => ({ user, course }))

  const getQuestions = async () => {
    const { questions, answers, completed } = await examService.getExam(user.id)
    setQuestions(questions)
    setAnswers(answers)
    setExamOn(completed !== true)
  }

  const startExam = async () => {
    const { questions, answers } = await examService.startExam(user.id)
    setQuestions(questions)
    setAnswers(answers)
    setExamOn(true)
  }

  const endExam = async () => {
    const { questions } = await examService.endExam(user.id)
    setQuestions(questions)
    setExamOn(false)
  }

  useEffect(() => {
    getQuestions()
  }, [])

  if (questions === null || answers === null) return null

  const doAnswer = (question, selection) => (e) => {
    if (!examOn) {
      return
    }

    const newSelection = e.target.checked
      ? answers[question].concat(selection)
      : answers[question].filter((e) => e !== selection)

    const newAnswers = { ...answers, [question]: newSelection }

    examService.setAnswers(user.id, newAnswers)
    setAnswers(newAnswers)
  }

  return (
    <div>
      <h3>Exam</h3>
      {!examOn && <button onClick={startExam}>start</button>}
      {examOn && <button onClick={endExam}>end</button>}
      {examOn ? 'exam is going' : 'exam has ended'}
      {questions.map((q) => (
        <Question
          key={q.id}
          question={q}
          lang="fi"
          doAnswer={doAnswer}
          answers={answers[Number(q.id)]}
          examOn={examOn}
        />
      ))}
    </div>
  )
}

export default Exam
