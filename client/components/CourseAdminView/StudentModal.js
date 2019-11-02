import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Modal } from 'semantic-ui-react'

const StudentModal = ({ student, getStudents }) => {
  const { course } = useSelector(({ course }) => ({ course }))
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const { student_number: studentNumber,
    first_names: firstName,
    last_name: lastName,
  } = student
  const fullName = `${firstName} ${lastName}`

  const handleSubmitEdit = async () => {
    try {
      getStudents()
      closeModal()
    } catch (err) {
      console.log(err)
    }
  }

  const logInAs = () => {
    localStorage.setItem('adminLoggedInAs', student.username)
    window.location.reload()
  }

  const jsonDump = `${window.location.origin}/stats/api/students/${studentNumber}/course/${course.info.name}`
  return (
    <Modal
      trigger={<button type="button" onClick={openModal}>{fullName}</button>}
      open={open}
      onClose={closeModal}
      centered={false}
    >
      <Modal.Header>{`${studentNumber} ${fullName}`}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <div>
            <a href={jsonDump}>View submission JSON</a>
          </div>
          <br />
          <Button onClick={logInAs}>Log in as</Button>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default StudentModal
