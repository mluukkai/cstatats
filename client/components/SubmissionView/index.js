import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import SubmissionForm from 'Components/SubmissionView/SubmissionForm'

const SubmissionView = () => {
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))

  let submissions = user && course.info
    ? user.submissions.filter(s => s.courseName === course.info.name) : []
  const week = course.info ? course.info.week : 0
  const submissionForWeeks = submissions.map(s => s.week)

  if (submissions.length === 0 && week === 1) return <SubmissionForm />

  const byPart = (p1, p2) => p1.week - p2.week

  const solutions = (part) => {
    if (part === 0) return <div>not available</div>
    return <Link to={`solutions/${part}`}>show</Link>
  }

  const maxWeek = Math.max(submissionForWeeks, week - 1)

  if (!user) return null

  const extension = user.extensions && user.extensions.find(e => e.to === course)

  if (extension) {
    submissions = []
    const extendSubmissions = extension.extendsWith
    const to = Math.max(...extendSubmissions.map(s => s.part), ...submissions.map(s => s.week))
    for (let index = 0; index <= to; index++) {
      const ext = extendSubmissions.find(s => s.part === index)
      const sub = submissions.find(s => s.week === index)
      if (ext && (!sub || ext.exercises > sub.exercises)) {
        const exercises = []
        for (let i = 0; i < ext.exercises; i++) {
          exercises.push(i)
        }
        submissions.push({
          exercises,
          comment: `credited from ${extension.from}`,
          week: index,
          _id: index,
        })
      } else if (sub) {
        submissions.push(sub)
      } else {
        submissions.push({
          week: index, exercises: [], _id: index, comment: 'no submission',
        })
      }
    }
  }

  const sum = (s, i) => s + i
  const exerciseTotal = submissions.map(s => s.exercises.length).reduce(sum, 0)
  const hoursTotal = submissions.map(s => s.time).reduce(sum, 0)

  for (let week = 1; week <= maxWeek; week++) {
    if (!submissionForWeeks.includes(week)) {
      submissions.push({
        week,
        _id: week,
        exercises: [],
      })
    }
  }
  return (
    <div>
      <h3>My submissions</h3>
      <SubmissionForm />
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>part</Table.HeaderCell>
            <Table.HeaderCell>exercises</Table.HeaderCell>
            <Table.HeaderCell>hours</Table.HeaderCell>
            <Table.HeaderCell>github</Table.HeaderCell>
            <Table.HeaderCell>comment</Table.HeaderCell>
            <Table.HeaderCell>solutions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {submissions.sort(byPart).map(s => (
            <Table.Row key={s._id}>
              <Table.Cell>{s.week}</Table.Cell>
              <Table.Cell>{s.exercises.length}</Table.Cell>
              <Table.Cell>{s.time}</Table.Cell>
              <Table.Cell><a href={`${s.github}`}>{s.github}</a></Table.Cell>
              <Table.Cell>{s.comment}</Table.Cell>
              <Table.Cell>
                {solutions(s.week)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell>total</Table.HeaderCell>
            <Table.HeaderCell>{exerciseTotal}</Table.HeaderCell>
            <Table.HeaderCell>{hoursTotal}</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  )
}

export default SubmissionView
