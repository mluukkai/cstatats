import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import courseService from 'Services/course'
import { initializeCourse, initializeStats } from 'Utilities/redux/courseReducer'
import Statistics from 'Components/Statistics'

const Course = ({ courseName }) => {
  const { course } = useSelector(({ course }) => ({ course }))
  const dispatch = useDispatch()
  useEffect(() => {
    const getInfo = async () => {
      const info = await courseService.getInfoOf(courseName)
      dispatch(initializeCourse(info))
    }

    const getStats = async () => {
      const stats = await courseService.getStatsOf(courseName)
      dispatch(initializeStats(stats))
    }

    getInfo()
    getStats()
  }, [])
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
