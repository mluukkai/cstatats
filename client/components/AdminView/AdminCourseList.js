import React from 'react'
import { List, Button } from 'semantic-ui-react'
import courseService from 'Services/course'
import CourseEditModal from 'Components/AdminView/CourseEditModal'

const AdminCourseList = ({ courses, fetchCourses }) => {
  const toggleCourse = courseName => async () => {
    await courseService.toggleCourse(courseName)
    fetchCourses()
  }

  const incrementWeek = course => async () => {
    await courseService.update(course.name, { week: course.week + 1 })
    fetchCourses()
  }

  const decrementWeek = course => async () => {
    await courseService.update(course.name, { week: course.week - 1 })
    fetchCourses()
  }

  return (
    <List divided verticalAlign="middle" style={{ paddingRight: '10%' }}>
      {courses.map((course) => {
        const iconName = course.enabled ? 'checkmark' : 'pause'
        const iconStyle = course.enabled ? { color: 'green' } : { color: 'firebrick' }
        const description = `${course.term} ${course.year}`
        return (
          <List.Item key={course.name}>
            <List.Content floated="right">
              <Button.Group>
                <Button icon="minus" onClick={decrementWeek(course)} />
                <Button content={`Week ${course.week}`} />
                <Button icon="plus" onClick={incrementWeek(course)} style={{ marginRight: '1em' }} />
              </Button.Group>
              <Button onClick={toggleCourse(course.name)}>Toggle</Button>
              <CourseEditModal course={course} fetchCourses={fetchCourses} />
            </List.Content>
            <List.Icon name={iconName} size="large" verticalAlign="middle" style={iconStyle} />
            <List.Content>
              <List.Header>{course.name}</List.Header>
              {description}
            </List.Content>
          </List.Item>
        )
      })}
    </List>
  )
}


export default AdminCourseList
