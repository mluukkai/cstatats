/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import moment from 'moment'
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

const Status = ({ examOn, examStatus, cnt, startTime }) => {
  if (!examStatus || !startTime) return null

  const endTime = moment(startTime).add(4, 'hours').format('HH:mm:ss')

  if (examOn)
    return (
      <div>
        exam started at {moment(startTime).format('HH:mm:ss')} and ends{' '}
        {endTime}
      </div>
    )

  const passed = examStatus.points / cnt > 0.5

  return (
    <div>
      <div>exam has ended</div>
      <div>
        {' '}
        points {examStatus.points.toFixed(1)}/{cnt.toFixed(1)}{' '}
        <span style={{ color: passed ? 'green' : 'red' }}>
          {passed ? 'passed' : 'failed'}
        </span>
      </div>
    </div>
  )
}

const Selection = ({ i, selection, doAnswer, checked, correct, examOn }) => {
  const alpha = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g']
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
  const [time, setTime] = useState(null)
  const [examStatus, setExamStatus] = useState(null)
  const { user } = useSelector(({ user, course }) => ({ user, course }))
  const [doesNotExist, setDoesNotExist] = useState(true)

  const getQuestions = async () => {
    const { questions, answers, completed, points, starttime, doesNotExist } =
      await examService.getExam(user.id)

    console.log(doesNotExist)

    if (doesNotExist) {
      setDoesNotExist(true)
      return
    }

    setTime(new Date(starttime))
    setQuestions(questions)
    setAnswers(answers)
    setExamOn(completed !== true)
    setExamStatus({
      points,
      completed,
    })
  }

  const startExam = async () => {
    const { questions, answers, starttime } = await examService.startExam(
      user.id,
    )

    setTime(new Date(starttime))
    setQuestions(questions)
    setAnswers(answers)
    setExamOn(true)
    setDoesNotExist(false)
  }

  const endExam = async () => {
    const { questions, points, completed } = await examService.endExam(user.id)
    setQuestions(questions)
    setExamStatus({
      points,
      completed,
    })
    setExamOn(false)
  }

  useEffect(() => {
    getQuestions()
  }, [])

  if (doesNotExist) {
    return (
      <div>
        <h3>Exam</h3>
        <button onClick={startExam}>start</button>
      </div>
    )
  }

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
      <Status
        examOn={examOn}
        examStatus={examStatus}
        cnt={questions.length}
        startTime={time}
      />
      {questions.map((q) => (
        <Question
          key={q.id}
          question={q}
          lang="fi"
          doAnswer={doAnswer}
          answers={answers[Number(q.id)]}
          examOn={examOn}
          examStatus={examStatus}
        />
      ))}
    </div>
  )
}

export default Exam
