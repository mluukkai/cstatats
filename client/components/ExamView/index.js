/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import examService from 'Services/exam'
import Question from './Question'

const Status = ({ examStatus, cnt }) => {
  if (!examStatus || examStatus.notInit) return null

  const willEnd = moment(examStatus.starttime)
    .add(4, 'hours')
    .format('HH:mm:ss')

  if (!examStatus.completed)
    return (
      <div>
        exam started at {moment(examStatus.starttime).format('HH:mm:ss')} and
        ends {willEnd} (the server time, note that your local time may differ!)
      </div>
    )

  const passed = examStatus.points / cnt > 0.5

  return (
    <div>
      <div>
        exam has ended{' '}
        {moment(examStatus.endtime).format('HH:mm:ss MMMM Do YYYY')}
      </div>
      <div>
        {' '}
        points
        {examStatus.points.toFixed(1)}/{cnt.toFixed(1)}{' '}
        <span style={{ color: passed ? 'green' : 'red' }}>
          {passed ? 'passed' : 'failed'}
        </span>
      </div>
    </div>
  )
}

const Exam = () => {
  const [questions, setQuestions] = useState(null)
  const [answers, setAnswers] = useState(null)
  const [examStatus, setExamStatus] = useState({
    notInit: true,
    completed: false,
  })

  const { user } = useSelector(({ user, course }) => ({ user, course }))
  const [doesNotExist, setDoesNotExist] = useState(true)

  const getQuestions = async () => {
    const {
      questions,
      answers,
      completed,
      points,
      starttime,
      doesNotExist,
      endedYesterday,
      endtime,
      retryAllowed,
    } = await examService.getExam(user.id)

    if (doesNotExist) {
      setDoesNotExist(true)
      return
    }

    setDoesNotExist(false)
    setQuestions(questions)
    setAnswers(answers)

    if (examStatus.completed !== completed) {
      console.log('exam has ended!')
    }

    setExamStatus({
      retryAllowed,
      endedYesterday,
      points,
      completed,
      endtime,
      starttime,
    })
  }

  const startExam = async () => {
    const { questions, answers, starttime, completed } =
      await examService.startExam(user.id)

    setQuestions(questions)
    setAnswers(answers)
    setDoesNotExist(false)

    setExamStatus({
      completed,
      starttime,
    })
  }

  const endExam = async () => {
    const { questions, points, completed, retryAllowed } =
      await examService.endExam(user.id)
    setQuestions(questions)
    setExamStatus({
      points,
      completed,
      retryAllowed,
    })

    console.log('exam has ended!')
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

  if (examStatus.notInit || questions === null || answers === null) {
    return null
  }

  const doAnswer = (question, selection) => async (e) => {
    if (examStatus.completed) {
      return
    }

    const newSelection = e.target.checked
      ? answers[question].concat(selection)
      : answers[question].filter((e) => e !== selection)

    const newAnswers = { ...answers, [question]: newSelection }

    const { questions, points, completed, starttime, endtime, retryAllowed } =
      await examService.setAnswers(user.id, newAnswers)

    setAnswers(newAnswers)

    setExamStatus({
      points,
      completed,
      starttime,
      endtime,
      retryAllowed,
    })
    setQuestions(questions)
  }

  const allowedToStart = examStatus.retryAllowed && examStatus.completed

  return (
    <div>
      <h3>Exam</h3>
      {allowedToStart && <button onClick={startExam}>start</button>}
      {!examStatus.completed && <button onClick={endExam}>end</button>}
      <Status examStatus={examStatus} cnt={questions.length} />
      {!examStatus.endedYesterday &&
        questions.map((q) => (
          <Question
            key={q.id}
            question={q}
            lang="fi"
            doAnswer={doAnswer}
            answers={answers[Number(q.id)]}
            examOn={!examStatus.completed}
          />
        ))}
    </div>
  )
}

export default Exam
