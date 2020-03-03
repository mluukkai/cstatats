import React, { useState } from 'react'
import { Form, Segment } from 'semantic-ui-react'

const NewCourseForm = ({ submitNew }) => {
  const initialCourse = { name: '', url: '', term: '', year: '', fullName: '', enabled: false, exercises: [] }
  const [course, setCourse] = useState(initialCourse)
  const weeks = course.exercises.length

  const submit = () => {
    submitNew(course)
  }

  const toggle = (e, { name }) => setCourse({ ...course, [name]: !course[name] })

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
            data-cy="course_name"
            value={course.name}
          />
          <Form.Input
            fluid
            label="Course full name"
            placeholder="AYTKT Ohjelmistotuotanto"
            onChange={handleTextChange}
            name="fullName"
            data-cy="course_full_name"
            value={course.fullName}
          />
          <Form.Input
            fluid
            label="Url"
            placeholder="https://courses.helsinki.fi"
            onChange={handleTextChange}
            name="url"
            data-cy="course_url"
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
            data-cy="course_term"
            value={course.term}
          />
          <Form.Input
            fluid
            label="Year"
            placeholder="2020"
            onChange={handleTextChange}
            name="year"
            data-cy="course_year"
            value={course.year}
          />
        </Form.Group>
        <Form.Group>
          <Form.Button onClick={handleWeekAdd} data-cy="add_week"> Add week </Form.Button>
          <Form.Button onClick={handleWeekRemove} data-cy="remove_week"> Remove week </Form.Button>
        </Form.Group>
        <Form.Group style={{ flexWrap: 'wrap' }}>
          {course.exercises.map((exerciseAmount, index) => (
            <Form.Input
              key={`week${index + 0}`}
              type="number"
              onChange={handleWeekChange(index)}
              value={exerciseAmount}
              placeholder={0}
              data-cy={`course_week_${index}`}
              label={`Week ${index} exercise count`}
            />
          ))}
        </Form.Group>
        <Form.Group>
          <Form.Checkbox
            name="enabled"
            onChange={toggle}
            checked={course.enabled}
            label="Enable course"
            data-cy="course_enable"
          />
          <Form.Checkbox
            name="miniproject"
            onChange={toggle}
            checked={course.miniproject}
            label="Enable miniproject"
            data-cy="miniproject_enable"
          />
          <Form.Checkbox
            name="extension"
            onChange={toggle}
            checked={course.extension}
            label="Enable extension"
            data-cy="extension_enable"
          />
          <Form.Checkbox
            name="peerReviewOpen"
            onChange={toggle}
            checked={course.peerReviewOpen}
            label="Peer review open"
            data-cy="peer_review_enable"
          />
        </Form.Group>
        <Form.Button onClick={submit} data-cy="submit">Submit</Form.Button>
      </Form>
    </Segment>
  )
}

export default NewCourseForm
