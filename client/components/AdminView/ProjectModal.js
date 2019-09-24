import React, { useState, useEffect } from 'react'
import { Button, Modal, List } from 'semantic-ui-react'
import projectService from 'Services/project'

const ProjectModal = ({ student }) => {
  const [project, setProject] = useState(undefined)

  const [open, setOpen] = useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)
  const projectId = student.project._id

  const getProject = async () => {
    const newProject = await projectService.getById(projectId)
    setProject(newProject)
  }

  useEffect(() => {
    getProject()
  }, [])

  const buttonElement = <Button onClick={openModal}>Project</Button>
  if (!project) return buttonElement

  const headerText = `${project.name} Github: ${project.github}`
  return (
    <Modal
      trigger={buttonElement}
      open={open}
      onClose={closeModal}
      centered={false}
    >
      <Modal.Header>{headerText}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <List bulleted>
            {project.users.map(user => (
              <List.Item key={user._id}>
                {`${user.first_names} ${user.last_name} (${user.student_number})`}
              </List.Item>
            ))}
          </List>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default ProjectModal
