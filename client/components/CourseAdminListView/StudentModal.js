import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal } from 'semantic-ui-react'
import SubmissionUpdateSegment from 'Components/CourseAdminListView/SubmissionUpdateSegment'
import projectService from 'Services/project'

const StudentModal = ({ student, getStudents }) => {
  const { courseName } = useSelector(({ course }) => ({ courseName: course.info.name }))
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const { student_number: studentNumber, name, username } = student

  const acceptStudent = async () => {
    if (!confirm('Are you sure?')) return
    setLoading(true)
    await projectService.acceptStudent(student.id)
    await getStudents()
    setLoading(false)
  }

  const logInAs = () => {
    localStorage.setItem('adminLoggedInAs', username)
    window.location.reload()
  }

  const jsonDump = `${window.location.origin}/stats/api/students/${username}/course/${courseName}`
  return (
    <Modal
      trigger={<button type="button" onClick={openModal}>{username}</button>}
      open={open}
      onClose={closeModal}
      centered={false}
    >
      <Modal.Header>{`${studentNumber || username} ${name}`}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <div>
            <a href={jsonDump}>View submission JSON</a>
          </div>
          <br />
          <Button onClick={acceptStudent} disabled={student.project.accepted || loading}>
            {student.project.accepted ? 'Hyväksiluettu' : 'Hyväksilue projekti'}
          </Button>
          <Button onClick={logInAs}>Log in as</Button>
          <SubmissionUpdateSegment student={student} getStudents={getStudents} />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default StudentModal
