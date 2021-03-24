import React from 'react'
import { useSelector } from 'react-redux'
import DockerSuotarView from 'Components/CourseAdminSuotarView/Docker/SuotarView'
import FullstackSuotarView from 'Components/CourseAdminSuotarView/Fullstack/SuotarView'

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

  if (
    courseName === 'docker2019' ||
    courseName === 'docker2020' ||
    courseName === 'docker2021' ||
    courseName === 'kubernetes2020'
  ) {
    return <DockerSuotarView />
  }

  return <FullstackSuotarView />
}

export default CourseAdminSuotarView
