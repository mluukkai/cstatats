import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'

const EditCourseForm = ({ course: oldCourse, handleSubmitEdit }) => {
  const [course, setCourse] = useState(oldCourse)
  const weeks = course.exercises.length

  const submit = () => {
    handleSubmitEdit(course)
  }
  const toggle = (e, { name }) => setCourse({ ...course, [name]: !course[name] })

  const handleTextChange = (e, { name, value }) => setCourse({ ...course, [name]: value })

  const handleWeekAdd = () => setCourse({ ...course, exercises: [...course.exercises, 0] })

  const handleWeekRemove = () => {
    const newWeeks = weeks - 1
    const exercises = course.exercises.slice(0, newWeeks)
    const enrolmentCheckData = course.enrolmentCheckData.filter(
      (data) => newWeeks > data.weekNumber,
    )
    setCourse({ ...course, exercises, enrolmentCheckData })
  }

  const handleWeekChange = (index) => (e, { value }) => {
    const newExercises = [...course.exercises]
    newExercises[index] = value
    setCourse({ ...course, exercises: newExercises })
  }

  const handleEnrolmentCheckCodeChange = (index) => (_, { value }) => {
    const enrolmentCheckWeek = course.enrolmentCheckData.find(ecd => Number(ecd.weekNumber) === index) || { weekNumber: index }
    enrolmentCheckWeek.code = value
    setCourse({ ...course, enrolmentCheckData: [...course.enrolmentCheckData.filter(w => w.weekNumber !== index), enrolmentCheckWeek] })
  }

  const handleEnrolmentCheckLinkChange = (index) => (_, { value }) => {
    const enrolmentCheckWeek = course.enrolmentCheckData.find(ecd => Number(ecd.weekNumber) === index) || { weekNumber: index }
    enrolmentCheckWeek.enrolmentLink = value
    
    setCourse({ ...course, enrolmentCheckData: [...course.enrolmentCheckData.filter(w => w.weekNumber !== index), enrolmentCheckWeek] })
  }

  return (
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
          label="Course full name"
          placeholder="AYTKT Ohjelmistotuotanto"
          onChange={handleTextChange}
          name="fullName"
          value={course.fullName}
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
        {course.exercises.map((exerciseAmount, index) => {
          const enrolmentCheckData = course.enrolmentCheckData.find(
            (data) => data.weekNumber === index,
          ) || {}
          const courseCode = enrolmentCheckData.code || ''
          const enrolmentLink = enrolmentCheckData.enrolmentLink || ''
          return (
            <div key={`week${index + 0}`}>
              <Form.Input
                type="number"
                onChange={handleWeekChange(index)}
                value={exerciseAmount}
                placeholder={0}
                label={`Week ${index} exercise count`}
              />
              <Form.Input
                onChange={handleEnrolmentCheckCodeChange(index)}
                value={courseCode}
                label={`Week ${index} course code`}
              />
              <Form.Input
                onChange={handleEnrolmentCheckLinkChange(index)}
                value={enrolmentLink}
                label={`Week ${index} course enrolment link`}
              />
            </div>
          )
        })}
      </Form.Group>
      <Form.Group>
        <Form.Checkbox
          name="enabled"
          onChange={toggle}
          checked={course.enabled}
          label="Course enabled"
        />
        <Form.Checkbox
          name="miniproject"
          onChange={toggle}
          checked={course.miniproject}
          label="Miniproject enabled"
        />
        <Form.Checkbox
          name="extension"
          onChange={toggle}
          checked={course.extension}
          label="Extension enabled"
        />
        <Form.Checkbox
          name="peerReviewOpen"
          onChange={toggle}
          checked={course.peerReviewOpen}
          label="Peer review open"
        />
      </Form.Group>
      <Form.Button onClick={submit}>Submit</Form.Button>
    </Form>
  )
}

export default EditCourseForm
