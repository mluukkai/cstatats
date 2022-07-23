/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Button } from 'semantic-ui-react'

import examService from 'Services/exam'
import Question from './Question'

export const nextTry = (time) => moment(time).add(7, 'days')

const Status = ({ examStatus, cnt }) => {
  if (!examStatus || examStatus.notInit) return null

  const willEnd = moment(examStatus.starttime)
    .add(2, 'hours')
    .format('HH:mm:ss')

  if (!examStatus.completed)
    return (
      <div style={{ marginTop: 10 }}>
        Exam started at {moment(examStatus.starttime).format('HH:mm:ss')} and
        ends {willEnd} (the server time, note that your local time may differ!)
      </div>
    )

  const passed = examStatus.points / cnt > 0.5

  const canBeTried = nextTry(examStatus.endtime)

  return (
    <div>
      <div style={{ marginTop: 10 }}>
        {examStatus.endedYesterday ? 'You did the exam  ' : ' Exam has ended  '}
        {moment(examStatus.endtime).format('HH:mm:ss MMMM Do YYYY')}
      </div>
      <div style={{ marginTop: 10 }}>
        You got {examStatus.points.toFixed(1)}/{cnt.toFixed(1)} points.
        <span style={{ color: passed ? 'green' : 'red' }}>
          {passed ? ' You passed the exam.' : ' You did not pass the exam.'}
        </span>
        <span>
          {passed ? '' : ' 2/3 of points needed for passing the Exam.'}
        </span>
      </div>
      {!examStatus.passed && !examStatus.retryAllowed && (
        <div style={{ marginTop: 10 }}>
          You can do the exam again at{' '}
          {canBeTried.format('HH:mm:ss  MMMM Do YYYY')}
        </div>
      )}
    </div>
  )
}

const LanguagePicker = ({ lang, setLang }) => {
  const setLanguage = (lang) => {
    setLang(lang)
    window.localStorage.setItem('fs-exam-language', lang)
  }

  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      Question language
      <span style={{ marginLeft: 5 }}>
        Finnish{' '}
        <input
          type="radio"
          checked={lang === 'fi'}
          onChange={() => setLanguage('fi')}
        />
      </span>
      <span style={{ marginLeft: 10 }}>
        English{' '}
        <input
          type="radio"
          checked={lang === 'en'}
          onChange={() => setLanguage('en')}
        />
      </span>
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
  const [doesNotExist, setDoesNotExist] = useState(true)
  const [lang, setLang] = useState('en')

  const topElementRef = useRef(null)

  const { user } = useSelector(({ user, course }) => ({ user, course }))

  useEffect(() => {
    const lang = window.localStorage.getItem('fs-exam-language')
    if (lang) {
      setLang(lang)
    }
  }, [])

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
      passed,
      order,
    } = await examService.getExam(user.id)

    if (doesNotExist) {
      setDoesNotExist(true)
      setAnswers([])
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
      passed,
      order,
    })
  }

  const startExam = async () => {
    const ok = window.confirm('Are you sure you want to start the exam now?')
    if (!ok) {
      return
    }

    const { questions, answers, starttime, completed, order } =
      await examService.startExam(user.id)

    setQuestions(questions)
    setAnswers(answers)
    setDoesNotExist(false)

    setExamStatus({
      completed,
      starttime,
      order,
    })
  }

  const endExam = async () => {
    const ok = window.confirm('Are you sure you want to end the exam now?')
    if (!ok) {
      return
    }

    const { questions, points, completed, retryAllowed, passed, order } =
      await examService.endExam(user.id)
    setQuestions(questions)
    setExamStatus({
      points,
      completed,
      retryAllowed,
      passed,
      order,
    })

    topElementRef.current.scrollIntoView()

    console.log('exam has ended!')
  }

  useEffect(() => {
    getQuestions()
  }, [])

  if (doesNotExist && answers === null) {
    return null
  }

  if (doesNotExist) {
    return (
      <div>
        <h3>Full Stack Open Exam</h3>
        <div style={{ marginBottom: 10 }}>
          <p>
            The exam time is 120 minutes. You need to get 2/3 points (= correct
            answers) to pass the exam. If you fail the exam, you can do it again
            in one week.
          </p>

          <p>
            Plagiarism, such as copying answers from the web or from a friend,
            and returning them as one's own work is prohibited. Read more{' '}
            <a href="https://guide.student.helsinki.fi/en/article/what-cheating-and-plagiarism">
              https://guide.student.helsinki.fi/en/article/what-cheating-and-plagiarism
            </a>
          </p>
        </div>
        <Button type="button" color="vk" onClick={startExam}>
          Start the exam
        </Button>
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

    const {
      questions,
      points,
      completed,
      starttime,
      endtime,
      retryAllowed,
      passed,
      order,
    } = await examService.setAnswers(user.id, newAnswers)

    setAnswers(newAnswers)

    setExamStatus({
      points,
      completed,
      starttime,
      endtime,
      retryAllowed,
      passed,
      order,
    })

    setQuestions(questions)
  }

  const allowedToStart = examStatus.retryAllowed && examStatus.completed

  const orderedQuestions = examStatus.order.map((n) =>
    questions.find((q) => q.id === n),
  )

  return (
    <div>
      <h3 ref={topElementRef}>Full Stack Open Exam</h3>
      {allowedToStart && (
        <Button type="button" color="vk" onClick={startExam}>
          Start the exam
        </Button>
      )}
      {!examStatus.completed && (
        <Button type="button" color="orange" onClick={endExam}>
          End the exam
        </Button>
      )}
      <Status examStatus={examStatus} cnt={questions.length} />
      {!examStatus.endedYesterday && (
        <LanguagePicker lang={lang} setLang={setLang} />
      )}
      {!examStatus.endedYesterday &&
        orderedQuestions.map((q) => (
          <Question
            key={q.id}
            question={q}
            lang={lang}
            doAnswer={doAnswer}
            answers={answers[Number(q.id)]}
            examOn={!examStatus.completed}
          />
        ))}
      {!examStatus.completed && (
        <Button type="button" color="orange" onClick={endExam}>
          End the exam
        </Button>
      )}
    </div>
  )
}

export default Exam
