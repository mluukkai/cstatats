/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Table, Button } from 'semantic-ui-react'
import studentService from 'Services/student'
import { submissionsToFullstackGradeAndCredits } from 'Utilities/common'
import SuotarDump from 'Components/CourseAdminSuotarView/Fullstack/SuotarDump'
import CompletedAndMarkedUsersList from 'Components/CourseAdminSuotarView/CompletedAndMarkedUsersList'
import examService from 'Services/exam'

const FullstackSuotarView = () => {
  const [notMarkedStudents, setNotMarkedStudents] = useState([])
  const [markedStudents, setMarkedStudents] = useState([])
  const completedDateSort = (a, b) =>
    new Date(b.completed).getTime() - new Date(a.completed).getTime()

  const { courseName } = useSelector(({ course }) => ({
    courseName: course.info.name,
  }))

  const [exams, setExams] = useState([])
  const [moodle, setMoodle] = useState([])

  useEffect(() => {
    examService.getAll().then(({ exams }) => {
      setExams(exams)
    })

    examService.getMoodle().then((exams) => {
      setMoodle(exams)
    })
  }, [])

  const getStudents = async () => {
    if (!courseName) return

    const newStudents = await studentService.getCompletedInCourse(courseName)

    const getRelevantCourseProgress = (stud) =>
      ((stud || {}).courseProgress || []).find(
        (c) => c.courseName === courseName,
      ) || {}

    const isInOodi = (stud) =>
      (getRelevantCourseProgress(stud).grading || {}).oodi

    const completedNotMarked = (stud) => {
      const prog = getRelevantCourseProgress(stud, courseName)
      // prog oodi is undefined if the student has not resumed progress, this is an actual false check
      if (prog.completed && prog.oodi === false) return true
      const completeByOldStandard =
        prog.completed &&
        prog.grading &&
        ((prog.grading.exam1 || {}).graded || (prog.grading.exam2 || {}).graded)
      if (completeByOldStandard) return false
      const inProgressByNewStandard = prog.completed && !prog.oodi
      return inProgressByNewStandard
    }

    const mapToUsefulData = (stud) => {
      const { grade, credits, creditsParts0to7, creditsPart8, creditsPart9 } =
        submissionsToFullstackGradeAndCredits(stud.submissions)
      const courseProgress = getRelevantCourseProgress(stud)
      const exam1 =
        courseProgress.exam1 !== undefined
          ? courseProgress.exam1
          : ((courseProgress.grading || {}).exam1 || {}).graded
      const exam2 =
        courseProgress.exam2 !== undefined
          ? courseProgress.exam2
          : ((courseProgress.grading || {}).exam2 || {}).graded

      return {
        studentNumber: stud.student_number,
        username: stud.username,
        name: stud.name,
        completed: courseProgress.completed,
        language: courseProgress.language,
        oodi: courseProgress.oodi,
        suotarReady: courseProgress.suotarReady,
        exam1,
        exam2,
        credits,
        creditsParts0to7,
        creditsPart8,
        creditsPart9,
        grade,
        courseProgress,
      }
    }
    const notYetMarked = newStudents
      .filter(completedNotMarked)
      .map(mapToUsefulData)
      .sort(completedDateSort)
    const alreadyMarked = newStudents
      .filter((stud) => !completedNotMarked(stud))
      .map(mapToUsefulData)
      .sort(completedDateSort)

    setNotMarkedStudents(notYetMarked)
    setMarkedStudents(alreadyMarked)
  }

  useEffect(() => {
    getStudents()
  }, [courseName])

  const handleClickOodi = (username, creditsParts0to7) => async () => {
    if (!window.confirm('Are you sure, this will hide the student')) return

    await studentService.updateStudentCourseProgress(username, {
      courseName,
      oodi: true,
      creditsParts0to7,
    })

    const newMarkedStudent = notMarkedStudents.find(
      (s) => s.username === username,
    )
    const newNotMarkedStudents = notMarkedStudents.filter(
      (s) => s.username !== username,
    )
    setMarkedStudents(
      markedStudents.concat([newMarkedStudent]).sort(completedDateSort),
    )
    setNotMarkedStudents(newNotMarkedStudents)
  }

  const allSuotarToOodi = async () => {
    if (
      !window.confirm('Are you absolutely sure to mark all suotared to oodi?')
    ) {
      return
    }

    if (!window.confirm('Confirm once more that you are sure')) {
      return
    }

    const updates = []
    for (let i = 0; i < notMarkedStudents.length; i++) {
      const student = notMarkedStudents[i]

      if (student.suotarReady) {
        const updated = {
          courseName,
          oodi: true,
          creditsParts0to7: student.creditsParts0to7,
        }
  
        updates.push({
          student: student.username,
          updated,
        })
      }
    }


    if (updates.length > 0) {
      await studentService.updateStudentsCourseProgress(updates)

      const updatedUsers = updates.map((u) => u.student)

      const newMarkedStudent = notMarkedStudents.filter((s) =>
        updatedUsers.includes(s.username),
      )

      const newNotMarkedStudents = notMarkedStudents.filter(
        (s) => !updatedUsers.includes(s.username),
      )

      setMarkedStudents(
        markedStudents.concat([newMarkedStudent]).sort(completedDateSort),
      )
      setNotMarkedStudents(newNotMarkedStudents)
    }
  }

  const handleRevertOodi = (username) => async () => {
    if (!window.confirm('Are you sure?')) return

    await studentService.updateStudentCourseProgress(username, {
      courseName,
      oodi: false,
    })
    const newNotMarkedStudent = markedStudents.find(
      (s) => s.username === username,
    )
    const newMarkedStudents = markedStudents.filter(
      (s) => s.username !== username,
    )
    setNotMarkedStudents(
      notMarkedStudents.concat([newNotMarkedStudent]).sort(completedDateSort),
    )
    setMarkedStudents(newMarkedStudents)
  }

  const handleClickFieldReady =
    (username, oldState = false) =>
    async ({ target }) => {
      const field = target.id
      const updated = {
        courseName,
        [field]: !oldState,
      }

      await studentService.updateStudentCourseProgress(username, updated)
      const newNotMarkedStudent = {
        ...notMarkedStudents.find((s) => s.username === username),
        ...updated,
      }
      const newStudents = notMarkedStudents
        .filter((s) => s.username !== username)
        .concat([newNotMarkedStudent])
        .sort(completedDateSort)
      setNotMarkedStudents(newStudents)
    }

  const creditsInOodi = (courseProgress) =>
    courseProgress.grading ? courseProgress.grading.credits : 0

  const examOf = (username, student_number) => {
    if (moodle.includes(student_number)) return 'moodle'

    const exam = exams.find((e) => e.username === username)
    if (exam) {
      return exam.passed ? 'passed' : 'failed'
    }
    return 'not done'
  }

  const onToggleSuotar = async () => {
    const updates = []
    for (let i = 0; i < notMarkedStudents.length; i++) {
      const student = notMarkedStudents[i]

      const updated = {
        courseName,
        suotarReady: !student.suotarReady,
      }

      updates.push({
        student: student.username,
        updated,
      })
    }

    await studentService.updateStudentsCourseProgress(updates)

    const newStudents = notMarkedStudents.map((s) => {
      return { ...s, suotarReady: !s.suotarReady }
    })

    setNotMarkedStudents(newStudents)
  }

  const suotarReadyStudents = notMarkedStudents.filter((s) => s.suotarReady)

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
            <Table.HeaderCell>Exam</Table.HeaderCell>
            <Table.HeaderCell>Suotar</Table.HeaderCell>
            <Table.HeaderCell>Oodi</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {notMarkedStudents.map(
            ({
              studentNumber,
              name,
              username,
              completed,
              suotarReady,
              credits,
              grade,
              creditsParts0to7,
              courseProgress,
            }) => (
              <Table.Row key={username}>
                <Table.Cell>{studentNumber}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{username}</Table.Cell>
                <Table.Cell>
                  {new Date(completed).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{credits}</Table.Cell>
                <Table.Cell>{grade}</Table.Cell>
                <Table.Cell>{examOf(username, studentNumber)}</Table.Cell>
                <Table.Cell
                  id="suotarReady"
                  style={{
                    backgroundColor: suotarReady ? 'lightgreen' : 'whitesmoke',
                    cursor: 'pointer',
                  }}
                  onClick={handleClickFieldReady(username, suotarReady)}
                />
                <Table.Cell
                  style={{ cursor: 'pointer' }}
                  onClick={handleClickOodi(username, creditsParts0to7)}
                >
                  {creditsInOodi(courseProgress)}
                </Table.Cell>
              </Table.Row>
            ),
          )}
        </Table.Body>
      </Table>

      <Button type="button" onClick={onToggleSuotar}>
        Toggle suotar
      </Button>

      <div style={{ marginTop: 20 }} />

      <div style={{ marginTop: 20 }} />

      <SuotarDump students={notMarkedStudents.filter((s) => s.suotarReady)} />

      <div style={{ marginTop: 20 }} />
      {suotarReadyStudents.length > 0 && (
        <Button type="button" onClick={allSuotarToOodi}>
          Mark all suotared to oodi
        </Button>
      )}

      <div style={{ marginTop: 20 }} />
      <CompletedAndMarkedUsersList
        students={markedStudents}
        revertOodi={handleRevertOodi}
      />
    </>
  )
}

export default FullstackSuotarView
