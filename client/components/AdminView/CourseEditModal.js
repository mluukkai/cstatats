import React, { useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import EditCourseForm from 'Components/AdminView/EditCourseForm'
import courseService from 'Services/course'

const CourseEditModal = ({ course, fetchCourses }) => {
  const [open, setOpen] = useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const handleSubmitEdit = async (editedObject) => {
    try {
      await courseService.update(course.name, editedObject)
      fetchCourses()
      closeModal()
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <Modal
      trigger={<Button onClick={openModal}>Edit Course</Button>}
      open={open}
      onClose={closeModal}
      centered={false}
    >
      <Modal.Header>{`Edit Course ${course.name}`}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <EditCourseForm course={course} handleSubmitEdit={handleSubmitEdit} close={closeModal} />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default CourseEditModal
