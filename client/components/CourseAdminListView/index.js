import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import studentService from 'Services/student'
import StudentModal from 'Components/CourseAdminListView/StudentModal'

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialValue)

  const setLocalStorage = (newValue) => {
    localStorage.setItem(key, newValue)
    setValue(newValue)
  }

  return [value, setLocalStorage]
}

const AdminView = () => {
  const { courseName, exercises, miniproject } = useSelector(({ course }) => {
    const courseName = ((course || {}).info || {}).name
    if (!courseName) return {}
    return { courseName: course.info.name, exercises: course.info.exercises, miniproject: course.info.miniproject }
  })
  const [split, setSplit] = useLocalStorage(`${courseName}_pagination`, 30)
  const [hasQuiz, setHasQuiz] = useState(false)
  const [filter, setFilter] = useState('')
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [page, setPage] = useState(0)
  const getStudentSubmissions = async () => {
    const newStudents = await studentService.getInCourse(courseName)
    setStudents(newStudents)
  }

  const changePagination = ({ target }) => setSplit(target.value)

  const changePage = newVal => setPage(Math.max(0, newVal))

  const filterStudents = () => {
    setFilteredStudents(students
      .filter(stud => Object.values(stud).find(val => val && val.includes && val.includes(filter))))
  }

  const changeFilter = ({ target }) => setFilter(target.value)

  useEffect(() => {
    filterStudents()
  }, [filter.length, students])

  useEffect(() => {
    if (!courseName) return

    getStudentSubmissions()
  }, [courseName])

  useEffect(() => {
    if (!students.length) return
    const quiz = students.find(stud => stud.quizAnswers && stud.quizAnswers[courseName])
    setHasQuiz(!!quiz)
  }, [students.length])
  if (!courseName) return null

  const shownStudents = filteredStudents.length ? filteredStudents : students
  const pageStart = page * split
  const pageEnd = (1 + page) * split
  return (
    <>
      <Link to={`/courses/${courseName}/admin/suotar`}>Suotar View</Link>
      <div>
        <button type="button" onClick={() => changePage(page - 1)}> Page backward</button>
        <input onChange={changeFilter} placeholder="search" />
        <button type="button" onClick={() => changePage(page + 1)}> Page forward</button>
        <p>{`Showing ${pageStart} - ${pageEnd} of ${filteredStudents.length || students.length}`}</p>
        <label>Pagination: </label>
        <input onChange={changePagination} value={split} placeholder="pagination" />
      </div>
      <Table celled striped compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan="2">Number</Table.HeaderCell>
            <Table.HeaderCell rowSpan="2">Name</Table.HeaderCell>
            <Table.HeaderCell rowSpan="2">Username</Table.HeaderCell>
            <Table.HeaderCell colSpan={`${exercises.length + 1}`}>Exercises</Table.HeaderCell>
            {hasQuiz && <Table.HeaderCell colSpan={`${exercises.length + 1}`}>Quiz points</Table.HeaderCell>}
            {miniproject && <Table.HeaderCell rowSpan="2">Project</Table.HeaderCell>}
          </Table.Row>
          <Table.Row>
            {exercises.map((week, idx) => <Table.HeaderCell key={`${idx + 0}`}>{idx}</Table.HeaderCell>)}
            <Table.HeaderCell>Total</Table.HeaderCell>
            {hasQuiz && (
              <>
                {exercises.map((week, idx) => <Table.HeaderCell key={`${idx + 0}`}>{idx}</Table.HeaderCell>)}
                <Table.HeaderCell>Total</Table.HeaderCell>
              </>
            )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {shownStudents.slice(pageStart, pageEnd).map((student) => {
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
                <Table.Cell>{studentNumber}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell><StudentModal student={student} getStudents={getStudentSubmissions} /></Table.Cell>
                {exercises.map((_, idx) => {
                  const weekly = submissions.find(s => s.week === idx)
                  return <Table.Cell key={`${idx + 0}`}>{weekly && weekly.exercises && weekly.exercises.length}</Table.Cell>
                })}
                <Table.Cell>{totalExercises}</Table.Cell>
                {hasQuiz && (
                  <>
                    {exercises.map((_, idx) => {
                      const partly = answersInCourse[idx] || {}
                      const isLocked = partly.locked || false
                      const score = partly.score || {}
                      return <Table.Cell style={{ background: isLocked ? 'PaleGreen' : '' }} key={`${idx + 0}`}>{score.total ? `${score.right}/${score.total} ${score.points}` : ''}</Table.Cell>
                    })}
                    <Table.Cell>{totalScore.toFixed(2)}</Table.Cell>
                  </>
                )}
                {miniproject && <Table.Cell style={{ backgroundColor: projectColor }}>{projectStatus.substr(0, 7)}</Table.Cell>}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </>
  )
}

export default AdminView
