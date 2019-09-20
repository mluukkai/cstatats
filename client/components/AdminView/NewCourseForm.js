import React, { useState } from 'react'
import { Form, Segment } from 'semantic-ui-react'

const NewCourseForm = ({ submitNew }) => {
  const initialCourse = { name: '', url: '', term: '', year: '', enabled: false, exercises: [] }
  const [course, setCourse] = useState(initialCourse)
  const weeks = course.exercises.length

  const submit = () => {
    submitNew(course)
  }

  const toggleEnabled = () => setCourse({ ...course, enabled: !course.enabled })
  const handleTextChange = (e, { name, value }) => setCourse({ ...course, [name]: value })

  const handleWeekAdd = () => setCourse({ ...course, exercises: [...course.exercises, 0] })
  const handleWeekRemove = () => setCourse({ ...course, exercises: course.exercises.slice(0, weeks - 1) })
  const handleWeekChange = index => (e, { value }) => {
    const newExercises = [...course.exercises]
    newExercises[index] = value
    setCourse({ ...course, exercises: newExercises })
  }

  return (
    <Segment>
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Course name"
            placeholder="Ohjelmistotuotanto"
            onChange={handleTextChange}
            name="name"
            value={course.name}
          />
          <Form.Input
            fluid
            label="Url"
            placeholder="https://courses.helsinki.fi"
            onChange={handleTextChange}
            name="url"
            value={course.url}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Term"
            placeholder="Spring"
            onChange={handleTextChange}
            name="term"
            value={course.term}
          />
          <Form.Input
            fluid
            label="Year"
            placeholder="2020"
            onChange={handleTextChange}
            name="year"
            value={course.year}
          />
        </Form.Group>
        <Form.Group>
          <Form.Button onClick={handleWeekAdd}> Add week </Form.Button>
          <Form.Button onClick={handleWeekRemove}> Remove week </Form.Button>
        </Form.Group>
        <Form.Group style={{ flexWrap: 'wrap' }}>
          {course.exercises.map((exerciseAmount, index) => (
            <Form.Input
              key={`week${index + 1}`}
              type="number"
              onChange={handleWeekChange(index)}
              value={exerciseAmount}
              placeholder={0}
              label={`Week ${index + 1} exercise count`}
            />
          ))}
        </Form.Group>
        <Form.Checkbox
          onChange={toggleEnabled}
          checked={course.enabled}
          label="Enable course"
        />
        <Form.Button onClick={submit}>Submit</Form.Button>
      </Form>
    </Segment>
  )
}

export default NewCourseForm
