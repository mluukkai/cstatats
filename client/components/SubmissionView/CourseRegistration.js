import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Flag } from 'semantic-ui-react'
import { credits, grade, basePath, extendedSubmissions } from 'Utilities/common'
import { Link } from 'react-router-dom'

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

    if (!user.name || !user.name.trim()) {
      return (
        <div>
          Fill in your name
          <Link to="/myinfo"> here </Link>
          if you want to get the course certificate
        </div>
      )
    }
    const certRandom = ((user.courseProgress || []).find(c => c.courseName === courseName) || {}).random
    if (!certRandom) return null
    const urlFin = `${window.location.origin}${basePath}api/certificate/${courseName}/fi/${certRandom}`
    const urlEn = `${window.location.origin}${basePath}api/certificate/${courseName}/en/${certRandom}`

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
    const e1 = (courseProgress.grading || {}).exam1
    const e2 = (courseProgress.grading || {}).exam2
    if (!e1 || !e2) return null

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
    if (user.name && user.name.trim() && user.student_number) return null

    return (
      <div>
        Fill in your student number and name
        <Link to="/myinfo"> here </Link>
        if you want to get the University of Helsinki credits.
      </div>
    )
  }

  const pretty = (date) => {
    const dd = new Date(date)
    return `Course marked as completed ${dd.getDate()}.${dd.getMonth() + 1} ${dd.getFullYear()}`
  }

  if (!courseProgress) return null
  return (
    <Segment>
      {nameNumberForm()}
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
