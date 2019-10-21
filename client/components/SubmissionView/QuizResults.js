import React from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'

const QuizResults = () => {
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))
  const { answers, score } = user.quizAnswers.find(a => a.course === course.info.name)
  const answersByPart = answers.reduce((acc, cur) => {
    if (!acc[cur.part]) {
      acc[cur.part] = score.find(s => s.part === cur.part)
    }
    return acc
  }, {})
  const parts = Object.keys(answersByPart)

  // const wrongAnswers = user.quizAnswers.filter(a => a.right === false)

  return (
    <>
      <h3> Quiz results</h3>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell> Part </Table.HeaderCell>
            <Table.HeaderCell> Score</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {parts.map(partName => (
            <Table.Row key={partName}>
              <Table.Cell>{partName}</Table.Cell>
              <Table.Cell>{answersByPart[partName].score}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

    </>
  )
}

export default QuizResults
