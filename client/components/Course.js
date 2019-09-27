import React from 'react'
import { useSelector } from 'react-redux'
import Statistics from 'Components/Statistics'

const Course = () => {
  const { course } = useSelector(({ course }) => ({ course }))

  if (!course.info) return null

  return (
    <div>
      <div>
        <h2>{course.info.fullName}</h2>
        <div style={{ paddingBottom: 10 }}>
          <em>
            {course.info.term.replace('fall', 'syksy')}
            {' '}
            {course.info.year}
          </em>
        </div>
        <p><a href={course.info.url}>course page</a></p>
        <Statistics />
      </div>
    </div>
  )
}

export default Course
