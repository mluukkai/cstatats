import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import quizService from 'Services/quiz'

const QuizResults = () => {
  const [openQuizzes, setOpenQuizzes] = useState([])
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))

  const getOpenQuizzes = async () => {
    const answersInPart = (user.quizAnswers || {})[course.info.name] || {}
    const allQuizzes = await quizService.getOpenQuizzes(course.info.name)
    const now = (new Date()).getTime()
    const relevantQuizzes = allQuizzes.filter((quiz) => {
      if (answersInPart[quiz.part] && answersInPart[quiz.part].locked) return false // Already answered
      if (!quiz.close) return true
      const closes = (new Date(quiz.close)).getTime()
      return now < closes
    }).filter((quiz) => {
      if (!quiz.open) return true

      const opens = (new Date(quiz.open)).getTime()
      return now > opens
    })
    setOpenQuizzes(relevantQuizzes)
  }

  useEffect(() => {
    getOpenQuizzes()
  }, [user, course])

  if (!openQuizzes.length) return null

  return (
    <>
      <h3>Open quizzes</h3>
      <Table celled striped>
        <Table.Body>
          {openQuizzes.map(quiz => (
            <Table.Row key={quiz.part}>
              <Table.Cell>{quiz.part}</Table.Cell>
              <Table.Cell><Link to={`quiz/${quiz.part}`}> Open </Link></Table.Cell>
              <Table.Cell>{quiz.close ? `Deadline: ${(new Date(quiz.close)).toLocaleString()}` : ''}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

export default QuizResults
