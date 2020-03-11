import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import studentService from 'Services/student'
import StudentModal from 'Components/CourseAdminView/StudentModal'

const AdminView = () => {
  const { courseName, exercises } = useSelector(({ course }) => {
    const courseName = ((course || {}).info || {}).name
    if (!courseName) return {}
    return { courseName: course.info.name, exercises: course.info.exercises }
  })
  const [students, setStudents] = useState([])

  const getStudentSubmissions = async () => {
    const newStudents = await studentService.getInCourse(courseName)
    setStudents(newStudents)
  }

  useEffect(() => {
    if (!courseName) return

    getStudentSubmissions()
  }, [courseName])

  if (!courseName) return null

  return (
    <Table celled striped compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowSpan="2" />
          <Table.HeaderCell rowSpan="2">Number</Table.HeaderCell>
          <Table.HeaderCell rowSpan="2">Name</Table.HeaderCell>
          <Table.HeaderCell rowSpan="2">Username</Table.HeaderCell>
          <Table.HeaderCell colSpan={`${exercises.length + 1}`}>Exercises</Table.HeaderCell>
          <Table.HeaderCell colSpan={`${exercises.length + 1}`}>Quiz points</Table.HeaderCell>
          <Table.HeaderCell rowSpan="2">Project</Table.HeaderCell>
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
            username,
            project,
            name,
            submissions,
            quizAnswers,
            total_exercises: totalExercises,
          } = student
          const answersInCourse = quizAnswers[courseName] || {}
          const totalScore = Object.values(answersInCourse).reduce((acc, cur) => Number(acc) + Number((cur.score || {}).points || 0), 0)
          const projectStatus = (project && project.accepted && 'Hyv.') || (project && project.name) || 'Ei'
          const projectColor = (projectStatus === 'Hyv.' && 'PaleGreen') || (projectStatus === 'Ei' && 'LightCoral') || ''
          return (
            <Table.Row key={username}>
              <Table.Cell>{idx}</Table.Cell>
              <Table.Cell>{studentNumber}</Table.Cell>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell><StudentModal student={student} getStudents={getStudentSubmissions} /></Table.Cell>
              {exercises.map((_, idx) => {
                const weekly = submissions.find(s => s.week === idx)
                return <Table.Cell key={`${idx + 0}`}>{weekly && weekly.exercises && weekly.exercises.length}</Table.Cell>
              })}
              <Table.Cell>{totalExercises}</Table.Cell>
              {exercises.map((_, idx) => {
                const partly = answersInCourse[idx] || {}
                const isLocked = partly.locked || false
                const score = partly.score || {}
                return <Table.Cell style={{ background: isLocked ? 'PaleGreen' : '' }} key={`${idx + 0}`}>{score.total ? `${score.right}/${score.total} ${score.points}` : ''}</Table.Cell>
              })}
              <Table.Cell>{totalScore.toFixed(2)}</Table.Cell>
              <Table.Cell style={{ backgroundColor: projectColor }}>{projectStatus.substr(0, 7)}</Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default AdminView
