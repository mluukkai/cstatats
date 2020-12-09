import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import {
  getUserAction,
  setCourseCompletedAction,
  setCourseNotCompletedAction,
} from 'Utilities/redux/userReducer'

import {
  submissionsToFullstackGradeAndCredits,
  submissionsToDockerCredits,
  validateStudentNumber,
  submissionsToReactNativeCredits,
  submissionsToKubernetesCredits,
  submissionsToCiCdCredits,
} from 'Utilities/common'

import isKubernetesCourse from 'Utilities/isKubernetesCourse'
import isDockerCourse from 'Utilities/isDockerCourse'
import isReactNativeCourse from 'Utilities/isReactNativeCourse'
import isCiCdCourse from 'Utilities/isCiCdCourse'

const getCreditsConfirmText = (credits) =>
  `If you complete course now you will get ${credits} credits. Are you sure?`

const getConfirmText = (courseName, submissions) => {
  if (isDockerCourse(courseName)) {
    return getCreditsConfirmText(submissionsToDockerCredits(submissions))
  }

  if (isKubernetesCourse(courseName)) {
    return getCreditsConfirmText(submissionsToKubernetesCredits(submissions))
  }

  if (isReactNativeCourse(courseName)) {
    return getCreditsConfirmText(submissionsToReactNativeCredits(submissions))
  }

  if (isCiCdCourse(courseName)) {
    return getCreditsConfirmText(submissionsToCiCdCredits(submissions))
  }

  if (courseName === 'ofs2019') {
    const [grade, credits] = submissionsToFullstackGradeAndCredits(submissions)
    return `Confirm this only if you have done the exam in Moodle or in an earlier course.\n\nIf you complete course now you will get ${credits} credits, grade ${grade}. Are you sure?`
  }
}

const CompletedButton = () => {
  const dispatch = useDispatch()
  const [sure, setSure] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { completed, courseName, confirmText, user } = useSelector(
    ({ course, user }) => {
      const courseName = (course.info || {}).name
      const { completed } =
        ((user || {}).courseProgress || []).find(
          (c) => c.courseName === courseName,
        ) || {}
      const submissions = user.submissions.filter(
        (sub) => sub.courseName === courseName,
      )

      const confirmText = getConfirmText(courseName, submissions)
      return { completed, courseName, confirmText, user }
    },
  )

  const handleToggleCompleted = async () => {
    setTimeout(() => setDisabled(false), 1000)
    setDisabled(true)
    if (!sure) return setSure(true)
    setSure(false)

    if (completed) await dispatch(setCourseNotCompletedAction(courseName))
    if (!completed) {
      const ok = window.confirm(confirmText)
      if (ok) {
        await dispatch(setCourseCompletedAction(courseName))
      }
    }
    dispatch(getUserAction())
  }

  const getText = () => {
    if (!completed && !sure) {
      return 'I have completed the course (exam done in Moodle and will not do more exercises) and want to get university credits registered.'
    }
    if (!completed && sure) {
      return 'Press again to confirm. Make sure that exam is done, everything is ready and submitted.'
    }
    if (completed && !sure) {
      return 'If you want to continue your progress, press here.'
    }
    if (completed && sure) {
      return 'Press again to continue your progress.'
    }
  }

  if (
    completed ||
    (user.name &&
      user.name.trim() &&
      validateStudentNumber(user.student_number))
  ) {
    const text = getText()
    return (
      <Button
        type="button"
        onClick={handleToggleCompleted}
        disabled={disabled}
        color={sure ? 'orange' : 'vk'}
      >
        {text}
      </Button>
    )
  }

  return (
    <div>
      Fill in your student number and name
      <Link to="/myinfo"> here </Link>
      if you want to get the University of Helsinki credits.
    </div>
  )
}
export default CompletedButton
