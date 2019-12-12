import React from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'

const QuizResults = () => {
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))
  const answersInCourse = user.quizAnswers[course.info.name] || {}
  const parts = Object.keys(answersInCourse || {})
  if (!parts.length) return null

  const total = parts.reduce((acc, cur) => {
    const { score } = answersInCourse[cur]
    if (!score) return acc

    const wrong = score.total - score.right
    return {
      wrong: acc.wrong + wrong,
      score: acc.score + score.points,
    }
  }, { wrong: 0, score: 0 })

  return (
    <>
      <h3>Quiz results</h3>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Part</Table.HeaderCell>
            <Table.HeaderCell>Right answers</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {parts.map((partName) => {
            const { score } = answersInCourse[partName]
            if (!score) return null

            return (
              <Table.Row key={partName}>
                <Table.Cell>{partName}</Table.Cell>
                <Table.Cell>{`${score.right} / ${score.total}`}</Table.Cell>
                <Table.Cell>{score.points}</Table.Cell>
              </Table.Row>
            )
          })}
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
            <Table.Cell>{`Missed: ${total.wrong}`}</Table.Cell>
            <Table.Cell>{`${total.score}`}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  )
}

export default QuizResults
