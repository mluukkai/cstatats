import React from 'react'
import { useSelector } from 'react-redux'
import QuestionSolution from 'Components/CourseQuizView/QuestionSolution'

const QuizSolutionsList = ({ part, questions = [] }) => {
  const { course, user } = useSelector(({ course, user }) => ({ course, user }))

  const { name } = course.info

  const previousAnswers = (((user.quizAnswers || {})[name] || {})[part] || {}).answers || []
  return (
    <>
      {questions.map(question => (
        <QuestionSolution
          key={question.id}
          question={question}
          previousAnswers={previousAnswers.filter(answer => answer.questionId === question.id)}
        />
      ))}
    </>
  )
}

export default QuizSolutionsList
