import React, { useState, useEffect } from 'react'
import { Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { shuffle } from 'Utilities/common'
import quizService from 'Services/quiz'
import Notification from 'Components/Notification'
import Question from 'Components/CourseQuizView/Question'
import { getUserAction } from 'Utilities/redux/userReducer'

const QuestionList = ({ part, deadlineHeader, questions, locked }) => {
  const { course, user } = useSelector(({ course, user }) => ({ course, user }))
  const dispatch = useDispatch()
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [notification, setNotification] = useState({ text: '', type: 'success' })

  const { name } = course.info

  useEffect(() => {
    setShuffledQuestions(shuffle(questions))
  }, [questions.length])

  const lockAnswers = async () => {
    try {
      await quizService.lockQuiz(name, part)
      setNotification({ text: 'Successfully locked answers', type: 'success' })
      dispatch(getUserAction())
    } catch (err) {
      setNotification({ text: `Failed: ${err.response.data.error}`, type: 'failure' })
    }
    setTimeout(() => setNotification({ text: undefined }), 5000)
  }

  const previousAnswers = (((user.quizAnswers || {})[name] || {})[part] || {}).answers || []
  return (
    <>
      <Notification notification={notification} />
      {shuffledQuestions.map(question => (
        <Question
          locked={locked}
          key={question.id}
          question={question}
          previousAnswers={previousAnswers.filter(answer => answer.questionId === question.id)}
        />
      ))}
      <Notification notification={notification} />
      {locked ? null : <Button onClick={lockAnswers}>Lock and submit answers</Button>}
    </>
  )
}

export default QuestionList
