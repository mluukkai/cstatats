import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import courseService from 'Services/course'
import { initializeCourse } from 'Utilities/redux/courseReducer'
import MiniprojectProject from 'Components/MiniprojectView/MiniprojectProject'
import MiniprojectReview from 'Components/MiniprojectView/MiniprojectReview'
import MiniprojectForm from 'Components/MiniprojectView/MiniprojectForm'

const MiniprojectView = ({ courseName }) => {
  const { user } = useSelector(({ user }) => ({ user }))
  const dispatch = useDispatch()

  const getCourseInfo = async () => {
    const info = await courseService.getInfoOf(courseName)
    dispatch(initializeCourse(info))
  }

  useEffect(() => {
    getCourseInfo()
  }, [])

  if (!user) return null

  return (
    <div>
      <MiniprojectForm />
      <MiniprojectProject />
      <MiniprojectReview />
    </div>
  )
}

export default MiniprojectView
