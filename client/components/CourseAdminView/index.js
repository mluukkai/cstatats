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

  const { exercises } = course.info
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
            quizzes,
            total_exercises: totalExercises,
          } = student

          const totalScore = Object.values(quizzes.scores).reduce((acc, cur) => acc + cur.points, 0)
          return (
            <Table.Row key={username}>
              <Table.Cell>{idx}</Table.Cell>
              <Table.Cell>{studentNumber}</Table.Cell>
              <Table.Cell>{`${firstName} ${lastName}`}</Table.Cell>
              <Table.Cell>{username}</Table.Cell>
              {exercises.map((_, idx) => {
                const weekly = submissions.find(s => s.week === idx)
                return <Table.Cell key={`${idx + 0}`}>{weekly && weekly.exercises}</Table.Cell>
              })}
              <Table.Cell>{totalExercises}</Table.Cell>
              {exercises.map((_, idx) => {
                const weekly = ((quizzes || {}).scores || {})[idx] || {}
                return <Table.Cell key={`${idx + 0}`}>{weekly.points}</Table.Cell>
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
