import React, { useState, useEffect } from 'react'
import { List, Button } from 'semantic-ui-react'
import courseService from 'Services/course'

const AdminStudentList = ({ course }) => {
  const [students, setStudents] = useState([])

  const fetchStudents = async () => {
    const newStudents = await courseService.getStudents(course.name)
    setStudents(newStudents)
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  console.log('Todo student controls')

  return (
    <List divided verticalAlign="middle" style={{ paddingRight: '10%' }}>
      {students.map((student) => {
        const fullName = `${student.first_names} ${student.last_name}`
        const header = `${fullName} (${student.username})`
        return (
          <List.Item key={student.username}>
            <List.Content floated="right">
              <Button>Button todo 1</Button>
              <Button>Button todo 2</Button>
              <Button>Button todo 3</Button>
            </List.Content>
            <List.Icon name="user" size="large" />
            <List.Content>
              <List.Header>{header}</List.Header>
              <List.Description></List.Description>
              <List.List>
                {student.submissions.map(submission => (
                  <List.Item key={submission.week}>
                    <List.Icon name="pen square" />
                    <List.Content>
                      <List.Header>
                        {`Week ${submission.week}`}
                      </List.Header>
                      <List.Description>
                        {`${submission.exercises} exercises & ${submission.time}h`}
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
