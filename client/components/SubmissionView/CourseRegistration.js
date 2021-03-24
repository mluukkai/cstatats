import React from 'react'
import { useSelector } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import {
  submissionsToFullstackGradeAndCredits,
  submissionsToDockerCredits,
  submissionsToReactNativeCredits,
  submissionsToKubernetesCredits,
  submissionsToCiCdCredits,
} from 'Utilities/common'

import isDockerCourse from 'Utilities/isDockerCourse'
import isKubernetesCourse from 'Utilities/isKubernetesCourse'
import isReactNativeCourse from 'Utilities/isReactNativeCourse'
import CertificateLink from 'Components/SubmissionView/CertificateLink'
import ExamInfo from 'Components/SubmissionView/ExamInfo'
import CompletedButton from 'Components/SubmissionView/CompletedButton'
import isCiCdCourse from 'Utilities/isCiCdCourse'

const availableCertLangs = {
  ofs2019: ['fi', 'en'],
  docker2019: ['en'],
  docker2020: ['en'],
  docker2021: ['en'],
  'fs-react-native-2020': ['fi', 'en'],
  kubernetes2020: ['en'],
  'fs-cicd': ['fi', 'en'],
}

const REGISTRATION_COURSES = [
  'ofs2019',
  'docker2019',
  'docker2020',
  'fs-react-native-2020',
  'kubernetes2020',
  'fs-cicd',
]

const componentShouldNotShow = (courseName) =>
  !REGISTRATION_COURSES.includes(courseName)

const courseHasCert = (courseName) =>
  isDockerCourse(courseName) ||
  courseName === 'ofs2019' ||
  isReactNativeCourse(courseName) ||
  isKubernetesCourse(courseName) ||
  isCiCdCourse(courseName)

const prettyCompleted = (date) => {
  const dd = new Date(date)
  return `Course marked as completed ${dd.getDate()}.${
    dd.getMonth() + 1
  } ${dd.getFullYear()}`
}

const CourseRegistration = () => {
  const { user, grade, credits, courseName } = useSelector(
    ({ user, course }) => {
      const courseName = ((course || {}).info || {}).name
      if (componentShouldNotShow(courseName)) return { courseName, user }
      const submissions = user.submissions.filter(
        (sub) => sub.courseName === courseName,
      )

      if (isDockerCourse(courseName)) {
        const credits = submissionsToDockerCredits(submissions)
        return { credits, user, courseName }
      }

      if (courseName === 'ofs2019') {
        const [grade, credits] = submissionsToFullstackGradeAndCredits(
          submissions,
        )
        return {
          grade,
          credits,
          user,
          courseName,
        }
      }

      if (isKubernetesCourse(courseName)) {
        return {
          credits: submissionsToKubernetesCredits(submissions),
          user,
          courseName,
        }
      }

      if (isReactNativeCourse(courseName)) {
        return {
          credits: submissionsToReactNativeCredits(submissions),
          user,
          courseName,
        }
      }

      if (isCiCdCourse(courseName)) {
        return {
          credits: submissionsToCiCdCredits(submissions),
          user,
          courseName,
        }
      }
    },
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

  const certLangs = availableCertLangs[courseName]

  const showCertLink = courseHasCert(courseName) && credits && certLangs

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
