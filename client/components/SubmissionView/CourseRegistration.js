import React from 'react'
import { useSelector } from 'react-redux'
import { Segment } from 'semantic-ui-react'

import {
  courseHasRegistration,
  getCourseCertLanguages,
  courseHasCert,
  getCourseCredits,
  getCourseGrade,
} from 'Utilities/common'

import CertificateLink from 'Components/SubmissionView/CertificateLink'
import ExamInfo from 'Components/SubmissionView/ExamInfo'
import CompletedButton from 'Components/SubmissionView/CompletedButton'

const componentShouldNotShow = (courseName) =>
  !courseHasRegistration(courseName)

const prettyCompleted = (date) => {
  const dd = new Date(date)
  return `Course marked as completed ${dd.getDate()}.${
    dd.getMonth() + 1
  } ${dd.getFullYear()}`
}

const selectRegistrationInfo = ({ user, course }) => {
  const courseName = ((course || {}).info || {}).name

  if (componentShouldNotShow(courseName)) {
    return { courseName, user }
  }

  const submissions = user.submissions.filter(
    (sub) => sub.courseName === courseName,
  )

  const grade = getCourseGrade(courseName, submissions)
  const credits = getCourseCredits(courseName, submissions)

  return {
    grade,
    credits,
    user,
    courseName,
  }
}

const CourseRegistration = () => {
  const { user, grade, credits, courseName } = useSelector(
    selectRegistrationInfo,
  )

  if (componentShouldNotShow(courseName)) return null

  const courseProgress =
    (user.courseProgress || []).find((c) => c.courseName === courseName) || {}

  const certRandom = courseProgress.random

  const getGradeText = (grade) => {
    if (!grade) return null
    return (
      <>
        <strong style={{ paddingRight: 3 }}>grade</strong>
        {grade}
      </>
    )
  }
  const getCreditsText = (credits) => {
    if (!credits) return null
    return (
      <>
        <strong style={{ paddingRight: 3, paddingLeft: 6 }}>credits</strong>
        <span style={{ paddingRight: 8 }}>{credits}</span>
      </>
    )
  }

  const certLangs = getCourseCertLanguages(courseName)

  const showCertLink = courseHasCert(courseName) && credits

  return (
    <Segment>
      {user && courseProgress.completed && (
        <div>
          <strong>{prettyCompleted(courseProgress.completed)}</strong>
        </div>
      )}
      <div>
        {getGradeText(grade)}
        {getCreditsText(credits)}
        {grade || credits ? <em>based on exercises</em> : null}
      </div>
      <ExamInfo courseProgress={courseProgress} />
      {showCertLink ? (
        <CertificateLink
          certRandom={certRandom}
          name={user.name}
          langs={certLangs}
        />
      ) : null}
      <CompletedButton />
    </Segment>
  )
}

export default CourseRegistration
