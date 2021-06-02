import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Message } from 'semantic-ui-react'

import {
  courseHasRegistration,
  getCourseCertLanguages,
  courseHasCert,
  getCourseCredits,
  getCourseGrade,
} from 'Utilities/common'

import CertificateLink from '../CertificateLink'
import ExamInfo from '../ExamInfo'
import CompletedForm from '../CompletedForm'

import styles from './CourseRegistration.module.css'

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

const CreditsInfo = ({ grade, credits }) => {
  const gradeText = grade ? <strong>grade {grade}</strong> : null

  const creditsText = credits ? <strong>{credits} credits</strong> : null

  const dividerText = grade ? ' and ' : ''

  return (
    <Message info>
      You are entitled to {gradeText}
      {dividerText}
      {creditsText} based on the exercises you have submitted
    </Message>
  )
}

const CourseRegistration = () => {
  const { user, grade, credits, courseName } = useSelector(
    selectRegistrationInfo,
  )

  if (componentShouldNotShow(courseName)) return null

  const courseProgress =
    (user.courseProgress || []).find((c) => c.courseName === courseName) || {}

  const certRandom = courseProgress.random

  const certLangs = getCourseCertLanguages(courseName)

  const showCertLink = courseHasCert(courseName) && credits

  return (
    <Segment>
      {user && courseProgress.completed && (
        <div>
          <strong>{prettyCompleted(courseProgress.completed)}</strong>
        </div>
      )}
      {grade || credits ? (
        <CreditsInfo grade={grade} credits={credits} />
      ) : null}
      <ExamInfo courseProgress={courseProgress} />
      {showCertLink ? (
        <CertificateLink
          certRandom={certRandom}
          name={user.name}
          langs={certLangs}
          className={styles.certLinksContainer}
        />
      ) : null}
      {credits && <CompletedForm />}
    </Segment>
  )
}

export default CourseRegistration
