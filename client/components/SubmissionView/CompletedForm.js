import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import {
  getUserAction,
  setCourseCompletedAction,
  setCourseNotCompletedAction,
} from 'Utilities/redux/userReducer'

import {
  validateStudentNumber,
  getCourseCredits,
  getCourseGrade,
  getCourseCompletionConfirmation,
  getCourseCompletionLanguages,
} from 'Utilities/common'

import HasEnrolledWidget from 'Components/HasEnrolledWidget'

const getConfirmText = (courseName, submissions) => {
  const credits = getCourseCredits(courseName, submissions)
  const grade = getCourseGrade(courseName, submissions)

  return getCourseCompletionConfirmation(courseName, { grade, credits })
}

const getButtonText = (completed, sure) => {
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

const selectCompletionInfo = ({ course, user }) => {
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
}

const languageNameByCode = {
  fi: 'Finnish',
  en: 'English',
}

const CompletedForm = () => {
  const { completed, courseName, confirmText, user } = useSelector(
    selectCompletionInfo,
  )

  const completionLanguages = getCourseCompletionLanguages(courseName)

  const dispatch = useDispatch()
  const [sure, setSure] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [language, setLanguage] = useState(completionLanguages[0])

  const hasCompletionLanguages = completionLanguages.length > 0

  const completionLanguageOptions = completionLanguages.map((code) => ({
    value: code,
    key: code,
    text: languageNameByCode[code] || code,
  }))

  const handleToggleCompleted = async () => {
    setTimeout(() => setDisabled(false), 1000)

    setDisabled(true)

    if (!sure) {
      setSure(true)
      return
    }
    
    setSure(false)

    if (completed) {
      await dispatch(setCourseNotCompletedAction(courseName))
    } else {
      const ok = window.confirm(confirmText)

      if (ok) {
        await dispatch(setCourseCompletedAction(courseName, { language }))
      }
    }

    dispatch(getUserAction())
  }

  const canComplete =
    completed ||
    (user.name &&
      user.name.trim() &&
      validateStudentNumber(user.student_number))

  const languageSelect = hasCompletionLanguages ? (
    <Form.Field>
      <Form.Select
        label="Completion language"
        value={language}
        name="completionLanguage"
        onChange={(e, { value }) => {
          setLanguage(value)
        }}
        options={completionLanguageOptions}
        placeholder="Select language"
      />
      <div>
        The language you wish to associate with your course completion
        information
      </div>
    </Form.Field>
  ) : null

  if (!canComplete) {
    return (
      <div>
        Fill in your student number and name
        <Link to="/myinfo"> here </Link>
        if you want to get the University of Helsinki credits.
      </div>
    )  
  }

  const text = getButtonText(completed, sure)

  return (
    <Form>
      {languageSelect}

      <Button
        type="button"
        onClick={handleToggleCompleted}
        disabled={disabled}
        color={sure ? 'orange' : 'vk'}
      >
        {text}
      </Button>

      <HasEnrolledWidget />
    </Form>
  )

}
export default CompletedForm
