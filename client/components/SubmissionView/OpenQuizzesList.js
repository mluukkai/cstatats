import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import quizService from 'Services/quiz'

const QuizResults = () => {
  const [unavailableQuizzes, setUnavailableQuizzes] = useState([])
  const [openQuizzes, setOpenQuizzes] = useState([])
  const [completedQuizzes, setCompletedQuizzes] = useState([])
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))

  const getOpenQuizzes = async () => {
    const answersInPart = (user.quizAnswers || {})[course.info.name] || {}
    const allQuizzes = await quizService.getOpenQuizzes(course.info.name)
    const now = (new Date()).getTime()
    const unavailable = []
    const completed = []
    const open = allQuizzes.filter((quiz) => {
      if (answersInPart[quiz.part] && answersInPart[quiz.part].locked) {
        completed.push(quiz)
        return false
      }
      if (!quiz.close) return true

      const closes = (new Date(quiz.close)).getTime()
      const notYetClosed = now < closes
      if (!notYetClosed) unavailable.push(quiz)

      return notYetClosed
    }).filter((quiz) => {
      if (!quiz.open) return true

      const opens = (new Date(quiz.open)).getTime()
      const alreadyOpen = now > opens
      if (!alreadyOpen) unavailable.push(quiz)

      return alreadyOpen
    })
    setUnavailableQuizzes(unavailable)
    setCompletedQuizzes(completed)
    setOpenQuizzes(open)
  }

  useEffect(() => {
    getOpenQuizzes()
  }, [user, course])

  if (!openQuizzes.length && !unavailableQuizzes.length && !completedQuizzes.length) return null

  return (
    <>
      <h3>Quizzes</h3>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell> Part </Table.HeaderCell>
            <Table.HeaderCell> Link </Table.HeaderCell>
            <Table.HeaderCell> Opens </Table.HeaderCell>
            <Table.HeaderCell> Closes </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {completedQuizzes.map(quiz => (
            <Table.Row key={quiz.part}>
              <Table.Cell>{quiz.part}</Table.Cell>
              <Table.Cell>
                {(new Date(quiz.close).getTime() > (new Date()).getTime()) ? 'Available after deadline' : <Link to={`quiz/${quiz.part}`}>View solutions</Link>}
              </Table.Cell>
              <Table.Cell disabled>{quiz.open ? `Opens: ${(new Date(quiz.open)).toLocaleString()}` : ''}</Table.Cell>
              <Table.Cell disabled>{quiz.close ? `Deadline: ${(new Date(quiz.close)).toLocaleString()}` : ''}</Table.Cell>
            </Table.Row>
          ))}
          {openQuizzes.map(quiz => (
            <Table.Row key={quiz.part}>
              <Table.Cell>{quiz.part}</Table.Cell>
              <Table.Cell><Link to={`quiz/${quiz.part}`}> Open </Link></Table.Cell>
              <Table.Cell>{quiz.open ? `Opens: ${(new Date(quiz.open)).toLocaleString()}` : ''}</Table.Cell>
              <Table.Cell>{quiz.close ? `Deadline: ${(new Date(quiz.close)).toLocaleString()}` : ''}</Table.Cell>
            </Table.Row>
          ))}
          {unavailableQuizzes.map(quiz => (
            <Table.Row key={quiz.part} disabled>
              <Table.Cell>{quiz.part}</Table.Cell>
              <Table.Cell>Not available</Table.Cell>
              <Table.Cell>{quiz.open ? `Opens: ${(new Date(quiz.open)).toLocaleString()}` : ''}</Table.Cell>
              <Table.Cell>{quiz.close ? `Deadline: ${(new Date(quiz.close)).toLocaleString()}` : ''}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

export default QuizResults
