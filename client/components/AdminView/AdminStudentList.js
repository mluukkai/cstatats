import React, { useState, useEffect } from 'react'
import { List, Button } from 'semantic-ui-react'
import courseService from 'Services/course'
import projectService from 'Services/project'
import ProjectModal from 'Components/AdminView/ProjectModal'
import { setNotification, clearNotification } from 'Utilities/redux/notificationReducer'

const AdminStudentList = ({ course }) => {
  const [students, setStudents] = useState([])

  const fetchStudents = async () => {
    const newStudents = await courseService.getStudents(course.name)
    setStudents(newStudents)
  }

  const acceptMiniproject = student => async () => {
    try {
      await projectService.acceptStudent(student.project._id, student.id)
      fetchStudents()
    } catch (err) {
      console.log(err)
      setNotification('Failed to accept project')
      setTimeout(() => clearNotification(), 8000)
    }
  }


  useEffect(() => {
    fetchStudents()
  }, [])

  return (
    <List divided verticalAlign="middle" style={{ paddingRight: '10%' }}>
      {students.map((student) => {
        const fullName = `${student.first_names} ${student.last_name}`
        const header = `${fullName} (${student.username})`
        const projectString = student.project.name ? `Project: ${student.project.name}` : null
        return (
          <List.Item key={student.username}>
            <List.Content floated="right">
              {student.project.accepted ? null : <Button onClick={acceptMiniproject(student)}>Accept miniproject</Button>}
              <Button>Button todo</Button>
              <ProjectModal student={student} />
            </List.Content>
            <List.Icon name="user" size="large" />
            <List.Content>
              <List.Header>{header}</List.Header>
              <List.Description>{projectString}</List.Description>
              <List.List>
                {student.submissions.map(submission => (
                  <List.Item key={submission.week}>
                    <List.Icon name="pen square" />
                    <List.Content>
                      <List.Header>
                        {`Week ${submission.week}`}
                      </List.Header>
                      <List.Description>
                        {`${submission.exercises} exercises & ${submission.time}h.`}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List.List>
            </List.Content>
          </List.Item>
        )
      })}
    </List>
  )
}

export default AdminStudentList
