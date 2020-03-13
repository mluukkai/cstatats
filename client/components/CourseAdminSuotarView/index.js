import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import studentService from 'Services/student'
import { submissionsToFullstackGradeAndCredits } from 'Utilities/common'
import SuotarDump from 'Components/CourseAdminSuotarView/SuotarDump'
import CompletedAndMarkedUsersList from 'Components/CourseAdminSuotarView/CompletedAndMarkedUsersList'

const CourseAdminSuotarView = () => {
  const [notMarkedStudents, setNotMarkedStudents] = useState([])
  const [markedStudents, setMarkedStudents] = useState([])
  const completedDateSort = (a, b) => (new Date(b.completed).getTime()) - (new Date(a.completed).getTime())

  const { courseName } = useSelector(({ course }) => ({ courseName: course.info.name }))

  const getStudents = async () => {
    if (!courseName) return

    const newStudents = await studentService.getCompletedInCourse(courseName)

    const getRelevantCourseProgress = stud => (((stud || {}).courseProgress || []).find(c => c.courseName === courseName) || {})

    const isInOodi = stud => ((getRelevantCourseProgress(stud)).grading || {}).oodi

    const completedNotMarked = (stud) => {
      const prog = getRelevantCourseProgress(stud, courseName)
      const completeByOldStandard = (prog.completed && (prog.grading && ((prog.grading.exam1 || {}).graded || (prog.grading.exam2 || {}).graded)))
      if (completeByOldStandard) return false
      const inProgressByNewStandard = prog.completed && !prog.oodi
      return inProgressByNewStandard
    }

    const mapToUsefulData = (stud) => {
      const submissions = stud.submissions.filter(sub => sub.courseName === courseName)
      const [grade, credits] = submissionsToFullstackGradeAndCredits(submissions)
      const courseProgress = getRelevantCourseProgress(stud)
      return {
        studentNumber: stud.student_number,
        username: stud.username,
        name: stud.name,
        completed: courseProgress.completed,
        oodi: courseProgress.oodi,
        suotarReady: courseProgress.suotarReady,
        credits,
        grade,
      }
    }
    const notYetMarked = newStudents.filter(completedNotMarked).map(mapToUsefulData)
      .sort(completedDateSort)
    const alreadyMarked = newStudents.filter(stud => !completedNotMarked(stud)).map(mapToUsefulData)
      .sort(completedDateSort)

    setNotMarkedStudents(notYetMarked)
    setMarkedStudents(alreadyMarked)
  }

  useEffect(() => {
    getStudents()
  }, [courseName])


  const handleClickOodi = username => async () => {
    if (!confirm('Are you sure, this will hide the student')) return

    await studentService.updateStudentCourseProgress(username, {
      courseName,
      oodi: true,
    })
    const newMarkedStudent = notMarkedStudents.find(s => s.username === username)
    const newNotMarkedStudents = notMarkedStudents.filter(s => s.username !== username)
    setMarkedStudents(markedStudents.concat([newMarkedStudent]).sort(completedDateSort))
    setNotMarkedStudents(newNotMarkedStudents)
  }

  const handleRevertOodi = username => async () => {
    if (!confirm('Are you sure?')) return

    await studentService.updateStudentCourseProgress(username, {
      courseName,
      oodi: false,
    })
    const newNotMarkedStudent = markedStudents.find(s => s.username === username)
    const newMarkedStudents = markedStudents.filter(s => s.username !== username)
    setNotMarkedStudents(notMarkedStudents.concat([newNotMarkedStudent]).sort(completedDateSort))
    setMarkedStudents(newMarkedStudents)
  }

  const handleClickSuotarReady = (username, oldState = false) => async () => {
    const updated = {
      courseName,
      suotarReady: !oldState,
    }
    await studentService.updateStudentCourseProgress(username, updated)
    const newNotMarkedStudent = {
      ...notMarkedStudents.find(s => s.username === username),
      ...updated,
    }
    const newStudents = notMarkedStudents.filter(s => s.username !== username).concat([newNotMarkedStudent]).sort((a, b) => a.username.localeCompare(b.username))
    setNotMarkedStudents(newStudents)
  }


  return (
    <>
      <Link to={`/courses/${courseName}/admin`}>Student list</Link>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Number</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Completed</Table.HeaderCell>
            <Table.HeaderCell>Credits</Table.HeaderCell>
            <Table.HeaderCell>Grade</Table.HeaderCell>
            <Table.HeaderCell>Suotar</Table.HeaderCell>
            <Table.HeaderCell>Oodi</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {notMarkedStudents.map(({ studentNumber, name, username, completed, suotarReady, credits, grade }) => (
            <Table.Row key={username}>
              <Table.Cell>{studentNumber}</Table.Cell>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{username}</Table.Cell>
              <Table.Cell>{new Date(completed).toLocaleDateString()}</Table.Cell>
              <Table.Cell>{credits}</Table.Cell>
              <Table.Cell>{grade}</Table.Cell>
              <Table.Cell
                style={{ backgroundColor: suotarReady ? 'lightgreen' : 'whitesmoke', cursor: 'pointer' }}
                onClick={handleClickSuotarReady(username, suotarReady)}
              />
              <Table.Cell
                style={{ cursor: 'pointer' }}
                onClick={handleClickOodi(username)}
              />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <SuotarDump students={notMarkedStudents.filter(s => s.suotarReady)} />
      <CompletedAndMarkedUsersList students={markedStudents} revertOodi={handleRevertOodi} />
    </>
  )
}

export default CourseAdminSuotarView
