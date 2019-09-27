import React, { useState, useEffect } from 'react'
import { Button } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import quizService from 'Services/quiz'
import Question from 'Components/Question'

const CourseQuizView = () => {
  const { course, user } = useSelector(({ course, user }) => ({ course, user }))
  const { week, name } = course.info
  const [weeklyQuestions, setWeeklyQuestions] = useState([])
  const [pendingAnswers, setPendingAnswers] = useState([])

  const getWeeklyQuestions = async () => {
    const quizzes = await quizService.getByCourse(name, week)
    setWeeklyQuestions(quizzes)
  }

  const submitAnswers = () => {
    quizService.submitQuiz(pendingAnswers)
  }

  useEffect(() => { getWeeklyQuestions() }, [])

  return (
    <div>
      {weeklyQuestions.map(question => (
        <Question
          key={question.id}
          question={question}
          setPendingAnswers={setPendingAnswers}
          pendingAnswers={pendingAnswers}
          previousAnswers={user.quizAnswers.filter(answer => answer.questionId === question.id)}
        />
      ))}
      <Button onClick={submitAnswers}>Submit</Button>
    </div>
  )
}

export default CourseQuizView
