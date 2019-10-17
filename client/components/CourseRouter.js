import React, { useEffect } from 'react'
import { withRouter, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { initializeCourse, initializeStats } from 'Utilities/redux/courseReducer'
import courseService from 'Services/course'

import MiniprojectView from 'Components/MiniprojectView'
import CourseQuizView from 'Components/CourseQuizView'
import SubmissionView from 'Components/SubmissionView'
import InstructorView from 'Components/InstructorView'
import Solutions from 'Components/Solutions'
import Crediting from 'Components/Crediting'
import Course from 'Components/Course'

const CourseRouter = ({ match }) => {
  const { path, params } = match
  const courseName = params.course
  const { course } = useSelector(({ course }) => ({ course }))
  const dispatch = useDispatch()

  const getInfo = async () => {
    const info = await courseService.getInfoOf(courseName)
    dispatch(initializeCourse(info))
  }

  const getStats = async () => {
    const stats = await courseService.getStatsOf(courseName)
    dispatch(initializeStats(stats))
  }

  useEffect(() => {
    getInfo()
    getStats()
  }, [])

  if (!course.info) return null

  return (
    <>
      <Route path={`${path}/`} exact component={Course} />
      <Route path={`${path}/quiz/:part`} exact component={CourseQuizView} />
      <Route path={`${path}/crediting`} exact component={Crediting} />
      <Route path={`${path}/instructor`} exact component={InstructorView} />
      <Route path={`${path}/submissions`} exact component={SubmissionView} />
      <Route path={`${path}/miniproject`} exact component={MiniprojectView} />

      <Route
        path={`${path}/solutions/:id`}
        render={({ match }) => <Solutions id={match.params.id} course={match.params.course} />}
      />
    </>
  )
}

export default withRouter(CourseRouter)
