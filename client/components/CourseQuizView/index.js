import React, { useState, useEffect } from 'react'
import { Button } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { shuffle } from 'Utilities/common'
import quizService from 'Services/quiz'
import Notification from 'Components/Notification'
import Question from 'Components/CourseQuizView/Question'

const CourseQuizView = ({ match }) => {
  const { course, user } = useSelector(({ course, user }) => ({ course, user }))
  const { name } = course.info
  const [available, setAvailable] = useState(undefined)
  const [deadline, setDeadline] = useState(undefined)
  const [open, setOpen] = useState(undefined)
  const [questions, setQuestions] = useState([])
  const [pendingAnswers, setPendingAnswers] = useState([])
  const [notification, setNotification] = useState({ text: '', type: 'success' })
  const { part } = match.params
  const getWeeklyQuestions = async () => {
    const { available, deadline, open, questions } = await quizService.getByCourse(name, part)
    setAvailable(available)
    setDeadline(deadline && new Date(deadline))
    setOpen(open && new Date(open))
    setQuestions(questions)
  }

  const submitAnswers = async () => {
    try {
      await quizService.submitQuiz(pendingAnswers)
      setNotification({ text: 'Successfully submitted answers', type: 'success' })
    } catch (err) {
      setNotification({ text: `Failed: ${err.response.data.error}`, type: 'failure' })
    }
    setTimeout(() => setNotification({ text: undefined }), 5000)
  }

  useEffect(() => { getWeeklyQuestions() }, [])

  const deadlineHeader = deadline ? `Deadline: ${deadline.toLocaleString()}` : ''
  if (!available) {
    const openingHeader = open ? `Opens: ${open.toLocaleString()}` : ''
    const both = open && deadline ? `Quiz is available between ${open.toLocaleString()} and ${deadline.toLocaleString()}` : ''
    return (
      <div>
        <h2>{both ? both : (open ? openingHeader : deadlineHeader)}</h2>
      </div>
    )
  }

  if (!questions || !questions.length) return <div> No questions here </div>
  return (
    <div>
      <Notification notification={notification} />
      <h1>{deadlineHeader}</h1>
      {shuffle(questions).map(question => (
        <Question
          key={question.id}
          question={question}
          setPendingAnswers={setPendingAnswers}
          pendingAnswers={pendingAnswers}
          previousAnswers={user.quizAnswers.filter(answer => answer.questionId === question.id)}
        />
      ))}
      <Notification notification={notification} />
      <Button onClick={submitAnswers}>Submit</Button>
    </div>
  )
}

export default CourseQuizView
