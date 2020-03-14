import React, { useEffect } from 'react'
import { withRouter, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { initializeCourse, initializeStats } from 'Utilities/redux/courseReducer'
import courseService from 'Services/course'

import MiniprojectView from 'Components/MiniprojectView'
import CourseAdminListView from 'Components/CourseAdminListView'
import CourseAdminSuotarView from 'Components/CourseAdminSuotarView'
import CourseQuizView from 'Components/CourseQuizView'
import SubmissionView from 'Components/SubmissionView'
import InstructorView from 'Components/InstructorView'
import SolutionsView from 'Components/SolutionsView'
import CreditingView from 'Components/CreditingView'
import CourseView from 'Components/CourseView'

const CourseRouter = ({ match, location, history }) => {
  const { path, params } = match
  const courseName = params.course.replace('fullstackopen', 'ofs2019')
  const { course } = useSelector(({ course }) => ({ course }))
  const dispatch = useDispatch()

  useEffect(() => {
    if (params.course !== 'ofs2019') return

    history.push({
      pathname: location.pathname.replace('ofs2019', 'fullstackopen'),
    })
  }, [params.course])

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

  if (!course || !course.info || !course.info.name) return null

  return (
    <>
      <Route path={`${path}/`} exact component={CourseView} />
      <Route path={`${path}/quiz/:part`} exact component={CourseQuizView} />
      <Route path={`${path}/crediting`} exact component={CreditingView} />
      <Route path={`${path}/submissions`} exact component={SubmissionView} />
      <Route path={`${path}/miniproject`} exact component={MiniprojectView} />
      <Route path={`${path}/instructor`} exact component={InstructorView} />
      <Route path={`${path}/admin`} exact component={CourseAdminListView} />
      <Route path={`${path}/admin/suotar`} exact component={CourseAdminSuotarView} />

      <Route
        path={`${path}/solutions/:id`}
        render={({ match }) => <SolutionsView id={match.params.id} course={courseName} />}
      />
    </>
  )
}

export default withRouter(CourseRouter)
