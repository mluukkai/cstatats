import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Table, Button } from 'semantic-ui-react'
import studentService from 'Services/student'
import SuotarDump from './SuotarDump'
import CompletedAndMarkedUsersList from '../CompletedAndMarkedUsersList'
import useStudents from './useStudents'

const GenericSuotarView = ({
  getCreditsBySubmissions,
  progressIsCompletedNotMarked,
}) => {
  const { courseName } = useSelector(({ course }) => ({
    courseName: course.info.name,
  }))

  const {
    markedStudents,
    notMarkedStudents,
    updateStudentProgress,
    updateStudentProgressLocally,
  } = useStudents(courseName, {
    getCreditsBySubmissions,
    progressIsCompletedNotMarked,
  })

  const handleClickOodi = (username) => async () => {
    if (!window.confirm('Are you sure, this will hide the student')) {
      return
    }

    await updateStudentProgress(username, {
      courseName,
      oodi: true,
    })
  }

  const handleRevertOodi = (username) => async () => {
    if (!window.confirm('Are you sure?')) {
      return
    }

    await updateStudentProgress(username, {
      courseName,
      oodi: false,
    })
  }

  const handleClickFieldReady =
    (username, oldState = false) =>
    async ({ target }) => {
      const field = target.id

      const update = {
        courseName,
        [field]: !oldState,
      }

      await updateStudentProgress(username, update)
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

      updateStudentProgressLocally(student.username, updated)
    }

    await studentService.updateStudentsCourseProgress(updates)
  }

  const allSuotarToOodi = async () => {
    if (
      !window.confirm('Are you absolutely sure to mark all suotared to oodi?')
    ) {
      return
    }

    const updates = []
    for (let i = 0; i < notMarkedStudents.length; i++) {
      const student = notMarkedStudents[i]

      if (!student.suotarReady) {
        break
      }

      const updated = {
        courseName,
        oodi: true,
        creditsParts0to7: student.creditsParts0to7,
      }

      updates.push({
        student: student.username,
        updated,
      })

      updateStudentProgressLocally(student.username, updated)
    }

    if (updates.length > 0) {
      await studentService.updateStudentsCourseProgress(updates)
    }
  }

  const suotarReadyStudents = notMarkedStudents.filter((s) => s.suotarReady)

  return (
    <>
      <h1>{courseName}</h1>
      <Link to={`/courses/${courseName}/admin`}>Student list</Link>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Number</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Completed</Table.HeaderCell>
            <Table.HeaderCell>Credits</Table.HeaderCell>
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
            }) => (
              <Table.Row key={username}>
                <Table.Cell>{studentNumber}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{username}</Table.Cell>
                <Table.Cell>
                  {new Date(completed).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{credits}</Table.Cell>
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
                  onClick={handleClickOodi(username)}
                >
                  {' '}
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

      {suotarReadyStudents.length > 0 && (
        <Button type="button" onClick={allSuotarToOodi}>
          Mark all suotared to oodi
        </Button>
      )}

      <div style={{ marginTop: 20 }} />

      <SuotarDump
        students={notMarkedStudents.filter((s) => s.suotarReady)}
        courseName={courseName}
      />

      <div style={{ marginTop: 20 }} />

      <CompletedAndMarkedUsersList
        students={markedStudents}
        revertOodi={handleRevertOodi}
      />
    </>
  )
}

export default GenericSuotarView
