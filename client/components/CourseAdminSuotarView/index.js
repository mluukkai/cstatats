import React from 'react'
import { useSelector } from 'react-redux'
import DockerSuotarView from 'Components/CourseAdminSuotarView/Docker/SuotarView'
import FullstackSuotarView from 'Components/CourseAdminSuotarView/Fullstack/SuotarView'
import { submissionsToReactNativeCredits } from 'Utilities/common'
import isReactNativeCourse from 'Utilities/isReactNativeCourse'
import GenericSuotarView from './GenericSuotarView'

const CourseAdminSuotarView = () => {
  const { courseName } = useSelector(({ course }) => ({
    courseName: course.info.name,
  }))

  if (courseName === 'docker2019' || courseName === 'docker2020') {
    return <DockerSuotarView />
  }

  if (isReactNativeCourse(courseName)) {
    return (
      <GenericSuotarView
        getCreditsBySubmissions={submissionsToReactNativeCredits}
      />
    )
  }

  return <FullstackSuotarView />
}

export default CourseAdminSuotarView
