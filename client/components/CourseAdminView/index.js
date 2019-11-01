import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import studentService from 'Services/student'

const AdminView = () => {
  const { course } = useSelector(({ course }) => ({ course }))
  const [students, setStudents] = useState([])

  const getStudentSubmissions = async () => {
    const newStudents = await studentService.getInCourse(course.info.name)
    setStudents(newStudents)
  }

  useEffect(() => {
    getStudentSubmissions()
  }, [])

  const { exercises, name } = course.info
  return (
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowSpan="2" />
          <Table.HeaderCell rowSpan="2">Student number</Table.HeaderCell>
          <Table.HeaderCell rowSpan="2">Name</Table.HeaderCell>
          <Table.HeaderCell rowSpan="2">Username</Table.HeaderCell>
          <Table.HeaderCell colSpan={`${exercises.length + 1}`}>Exercises</Table.HeaderCell>
          <Table.HeaderCell colSpan={`${exercises.length + 1}`}>Quiz points</Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          {exercises.map((week, idx) => <Table.HeaderCell key={`${idx + 0}`}>{idx}</Table.HeaderCell>)}
          <Table.HeaderCell>Total</Table.HeaderCell>
          {exercises.map((week, idx) => <Table.HeaderCell key={`${idx + 0}`}>{idx}</Table.HeaderCell>)}
          <Table.HeaderCell>Total</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {students.map((student, idx) => {
          const {
            student_number: studentNumber,
            first_names: firstName,
            last_name: lastName,
            username,
            project,
            submissions,
            quizAnswers,
            total_exercises: totalExercises,
          } = student
          const answersInCourse = quizAnswers[name] || {}
          const totalScore = Object.values(answersInCourse).reduce((acc, cur) => Number(acc) + Number(cur.score.points), 0)
          const jsonDump = `${window.location.origin}/stats/api/students/${studentNumber}/course/${course.info.name}`
          return (
            <Table.Row key={username}>
              <Table.Cell>{idx}</Table.Cell>
              <Table.Cell>{studentNumber}</Table.Cell>
              <Table.Cell><a href={jsonDump}>{`${firstName} ${lastName}`}</a></Table.Cell>
              <Table.Cell>{username}</Table.Cell>
              {exercises.map((_, idx) => {
                const weekly = submissions.find(s => s.week === idx)
                return <Table.Cell key={`${idx + 0}`}>{weekly && weekly.exercises}</Table.Cell>
              })}
              <Table.Cell>{totalExercises}</Table.Cell>
              {exercises.map((_, idx) => {
                const partly = answersInCourse[idx] || {}
                const score = partly.score || {}
                return <Table.Cell key={`${idx + 0}`}>{score.total ? `${score.right}/${score.total}: ${score.points}` : ''}</Table.Cell>
              })}
              <Table.Cell>{totalScore}</Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default AdminView
