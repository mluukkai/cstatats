import React from 'react'
import { useSelector } from 'react-redux'
import DockerSuotarView from 'Components/CourseAdminSuotarView/Docker/SuotarView'
import FullstackSuotarView from 'Components/CourseAdminSuotarView/Fullstack/SuotarView'

const CourseAdminSuotarView = () => {
  const { courseName } = useSelector(({ course }) => ({ courseName: course.info.name }))

  if (courseName === 'docker2019' || courseName === 'docker2020') {
    return <DockerSuotarView />
  }

  return <FullstackSuotarView />
}

export default CourseAdminSuotarView
