import React, { useState, useEffect } from 'react'
import examService from 'Services/exam'
import { useSelector } from 'react-redux'

const Selection = ({ i, selection, doAnswer, checked }) => {
  const alpha = ['', 'a', 'b', 'c', 'd', 'e', 'f']
  const style = {
    margin: 10,
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
        {alpha[i]}.
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

  return (
    <div style={style}>
      <h4>{question.question[lang].title}</h4>
      <div>{question.question[lang].body}</div>
      <div>
        {question.selections[lang].map((s) => (
          <Selection
            key={s.id}
            selection={s}
            i={s.id}
            doAnswer={doAnswer(question.id, s.id)}
            checked={answers.includes(s.id)}
            examOn={examOn}
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
    const data = await examService.endExam(user.id)
    console.log(data)
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
      <button onClick={startExam}>start</button>
      <button onClick={endExam}>end</button>
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
