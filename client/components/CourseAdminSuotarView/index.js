import React from 'react'
import { useSelector } from 'react-redux'
import DockerSuotarView from 'Components/CourseAdminSuotarView/Docker/SuotarView'
import FullstackSuotarView from 'Components/CourseAdminSuotarView/Fullstack/SuotarView'
import RailsSuotarView from 'Components/CourseAdminSuotarView/Rails/SuotarView'

import {
  courseHasDefaultSuotarView,
  getConfigForCourse,
} from 'Utilities/common'

import GenericSuotarView from './GenericSuotarView'

const CourseAdminSuotarView = () => {
  const { courseName } = useSelector(({ course }) => ({
    courseName: course.info.name,
  }))

  const hasDefaultSuotarView = courseHasDefaultSuotarView(courseName)

  if (hasDefaultSuotarView) {
    const courseConfig = getConfigForCourse(courseName)

    return (
      <GenericSuotarView getCreditsBySubmissions={courseConfig.getCredits} />
    )
  }

  if (courseName.includes('docker2023') ) {
    const courseConfig = getConfigForCourse(courseName)
    
    return (
      <GenericSuotarView getCreditsBySubmissions={courseConfig.getCredits} />
    )
  }

  if (courseName.includes('docker20') || courseName.includes('kubernetes20')) {
    return <DockerSuotarView />
  }

  if (courseName.includes('rails')) {
    return <RailsSuotarView />
  }

  return <FullstackSuotarView />
}

export default CourseAdminSuotarView
