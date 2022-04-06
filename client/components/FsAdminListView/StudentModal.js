import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal } from 'semantic-ui-react'
import SubmissionUpdateSegment from 'Components/CourseAdminListView/SubmissionUpdateSegment'
import studentService from 'Services/student'

const StudentModal = ({ student, getStudents, updateStudent }) => {
  const { courseName } = useSelector(({ course }) => ({
    courseName: course.info.name,
  }))

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [acualStudent, setAcualStudent] = useState(student)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const { student_number: studentNumber, name, username } = student

  const logInAs = () => {
    localStorage.setItem('adminLoggedInAs', username)
    window.location.reload()
  }

  const jsonDump = `${window.location.origin}/stats/api/students/${username}/course/${courseName}`

  useEffect(() => {
    if (open) {
      studentService
        .getSubmissions(courseName, username)
        .then((submissions) => {
          setAcualStudent({
            ...acualStudent,
            submissions,
          })

          updateStudent({
            ...acualStudent,
            submissions,
          })
        })
    }
  }, [open])

  return (
    <Modal
      trigger={
        <button type="button" onClick={openModal}>
          {username}
        </button>
      }
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

          <div>mää</div>

          <Button onClick={logInAs}>Log in as</Button>
          <SubmissionUpdateSegment
            student={acualStudent}
            getStudents={getStudents}
          />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default StudentModal
