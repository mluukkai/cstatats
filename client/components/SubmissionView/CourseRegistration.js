import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Form, Input, Segment, Flag } from 'semantic-ui-react'
import { clearNotification, setNotification } from 'Utilities/redux/notificationReducer'
import { credits, grade, basePath, extendedSubmissions } from 'Utilities/common'

const CourseRegistration = () => {
  const { user, totalExercises, submissions, part8, courseName } = useSelector(({ user, course }) => {
    const courseName = ((course || {}).info || {}).name
    if (courseName !== 'ofs2019') return { courseName }
    const submissions = extendedSubmissions(user, courseName)
    const part8 = submissions.find(s => s.week === 8)
    return {
      totalExercises: submissions.filter(s => s.week !== 8)
        .map(s => s.exercises.length).reduce((s, o) => s + o, 0),
      part8: part8 ? part8.exercises.length > 21 : 0,
      user,
      submissions,
      courseName,
    }
  })
  if (courseName !== 'ofs2019') return null

  const courseProgress = (user.courseProgress || []).find(c => c.courseName === courseName)
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [studentNumber, setStudentNumber] = useState(user.student_number || '')
  const [newName, setNewName] = useState(user.name || '')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const message = studentNumber ? `are you sure ${studentNumber} is your University of Helsinki student number?` : `are you sure to save the name ${newName}?`

    const ok = window.confirm(message)
    if (!ok) return

    const object = {
      student_number: studentNumber,
      name: newName,
    }

    console.log(object)

    dispatch(setNotification('Your information is saved'))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 8000)
  }

  const handleNameSubmit = async (e) => {
    e.preventDefault()

    const ok = window.confirm(`Save ${newName} as name?`)
    if (!ok) return

    console.log(newName)

    dispatch(setNotification('name saved'))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 8000)
  }

  const handleStudentNumberChange = ({ target }) => setStudentNumber(target.value)
  const handleNameChange = ({ target }) => setNewName(target.value)

  const renderCredits = () => {
    const stud = {
      total_exercises: totalExercises,
      submissions,
    }

    return (
      <div style={{ paddingTop: 10, paddingRight: 5 }}>
        <strong style={{ paddingRight: 3 }}>grade</strong>
        {grade(stud)}
        <strong style={{ paddingRight: 3, paddingLeft: 6 }}>credits</strong>
        <span style={{ paddingRight: 8 }}>{credits(stud) + (part8 ? 1 : 0)}</span>
        <em>based on exercises</em>
      </div>
    )
  }

  const certificate = () => {
    const stud = {
      total_exercises: totalExercises,
      submissions,
    }

    if (credits(stud) < 3) return null

    if (!user.name) {
      return (
        <div style={{ paddingTop: 10, paddingRight: 5 }}>
          <Segment>
            <h5>Save your name if you want to get the course certificate</h5>
            <Form onSubmit={handleNameSubmit}>
              <Form.Field>
                <Input
                  value={newName}
                  name="name"
                  onChange={handleNameChange}
                />
              </Form.Field>
              <Button primary>Save</Button>
            </Form>
          </Segment>
        </div>
      )
    }

    if (!((user.courseProgress || []).find(c => c.courseName === courseName) || {}).random) return null
    const urlFin = `${window.location.origin}${basePath}api/certificate/${courseName}/fi/${user.random}`
    const urlEn = `${window.location.origin}${basePath}api/certificate/${courseName}/en/${user.random}`

    return (
      <div style={{ paddingTop: 10, paddingRight: 5 }}>
        <strong>Certificate</strong>
        <a href={urlFin}><Flag name="finland" /></a>
        <a href={urlEn}><Flag name="uk" /></a>
      </div>
    )
  }

  const renderExams = () => {
    if (!courseProgress) return null
    const e1 = courseProgress.grading.exam1
    const e2 = courseProgress.grading.exam2

    const status = (e) => {
      if (e.graded) return 'passed'
      if (e.done) return 'done'

      return ''
    }

    return (
      <div>
        {status(e1).length > 0 && (
          <div style={{ paddingTop: 10 }}>
            <strong style={{ paddingRight: 3 }}>Exam 1</strong> {status(e1)}
          </div>
        )
        }
        {status(e2).length > 0 && (
          <div style={{ paddingTop: 10 }}>
            <strong style={{ paddingRight: 3 }}>Exam 2</strong> {status(e2)}
          </div>
        )}

        {renderCredits()}
      </div>
    )
  }

  const nameNumberForm = () => {

    if (user.student_number === null || user.student_number === undefined || user.name === null || user.name === undefined) {
      const noname = !user.name
      const nonumber = !user.student_number

      if (visible === false) {
        let toSave = 'name and student number'
        if (user.name) {
          toSave = 'student number'
        } else if (user.student_number) {
          toSave = 'name'
        }

        return (
          <div>
            <Button fluid onClick={() => setVisible(true)}>
              If you are planning to get University of Helsinki credits from the course, click here to save your {toSave}
            </Button>
          </div>
        )
      }
      const valid = ((studentNumber.length === 9 && studentNumber[0] === '0' && studentNumber[1] === '1') || user.student_number)
        && (newName.length > 5 || user.name)

      return (
        <Segment>
          <h4>Give your information</h4>
          <Form onSubmit={handleSubmit}>
            {nonumber && (
              <Form.Field>
                <label>Helsinki University student number</label>
                <Input
                  value={studentNumber}
                  name="student_number"
                  onChange={handleStudentNumberChange}
                />
              </Form.Field>
            )}
            {noname && (
              <Form.Field>
                <label>Name</label>
                <Input
                  value={newName}
                  name="name"
                  onChange={handleNameChange}
                />
              </Form.Field>
            )}

            <Button disabled={!valid} primary>Save</Button>
            <Button onClick={() => setVisible(false)}>Cancel</Button>
          </Form>
        </Segment>

      )
    }

    return null
  }

  const pretty = (date) => {
    const dd = new Date(date)
    return `Course marked as completed ${dd.getDate()}.${dd.getMonth() + 1} ${dd.getFullYear()}`
  }

  if (!courseProgress) return null
  return (
    <Segment>
      {nameNumberForm()}
      <h4>Your information</h4>
      <div style={{ paddingBottom: 3 }}>
        {user.name} <em>{user.student_number}</em>
      </div>
      {(user && courseProgress.completed) && (
        <div style={{ paddingTop: 10 }}>
          <strong>
            {pretty(courseProgress.completed)}
          </strong>
        </div>
      )}
      <div>
        {renderExams()}
      </div>
      {certificate()}
    </Segment>
  )
}

export default CourseRegistration
