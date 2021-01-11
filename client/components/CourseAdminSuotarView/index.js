import React from 'react'
import { useSelector } from 'react-redux'
import DockerSuotarView from 'Components/CourseAdminSuotarView/Docker/SuotarView'
import FullstackSuotarView from 'Components/CourseAdminSuotarView/Fullstack/SuotarView'

import {
  submissionsToReactNativeCredits,
  submissionsToCiCdCredits,
} from 'Utilities/common'

import isReactNativeCourse from 'Utilities/isReactNativeCourse'
import isCiCdCourse from 'Utilities/isCiCdCourse'
import GenericSuotarView from './GenericSuotarView'

const CourseAdminSuotarView = () => {
  const { courseName } = useSelector(({ course }) => ({
    courseName: course.info.name,
  }))

  if (courseName === 'docker2019' || courseName === 'docker2020' || courseName === 'kubernetes2020') {
    return <DockerSuotarView />
  }

  if (isReactNativeCourse(courseName)) {
    return (
      <GenericSuotarView
        getCreditsBySubmissions={submissionsToReactNativeCredits}
      />
    )
  }

  if (isCiCdCourse(courseName)) {
    return (
      <GenericSuotarView getCreditsBySubmissions={submissionsToCiCdCredits} />
    )
  }

  return <FullstackSuotarView />
}

export default CourseAdminSuotarView
