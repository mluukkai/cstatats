import React, { useState } from 'react'
import { Button, Form, Message } from 'semantic-ui-react'
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

const CompletedForm = ({ courseCompleted }) => {
  const { completed, courseName, confirmText, user } =
    useSelector(selectCompletionInfo)

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

  const languageSelect =
    !courseCompleted && hasCompletionLanguages ? (
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

  if (!canComplete && courseName.includes('fs')) {
    return (
      <div>
        <Message
          header={`In order to get the university credits`}
          content={
            <div style={{ marginTop: 10 }}>
              <ul>
                <li>
                  enroll to the Open Universty course{' '}
                  <a href="https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-dbf5a51d-2121-4110-af0f-f1e8f0b74fb9">
                    here
                  </a>
                </li>
                <li>
                  fill in your student number and name{' '}
                  <Link to="/myinfo"> here </Link> if you want to get the
                  University of Helsinki credits.
                </li>
                <li>do the exam in Moodle</li>
              </ul>
            </div>
          }
        />
      </div>
    )
  }

  if (!canComplete) {
    return (
      <div>
        <Message
          header={`In order to get the university credits`}
          content={
            <div style={{ marginTop: 10 }}>
              <ul>
                <li>
                  enroll to the Open Universty course, see the course page for
                  more info
                </li>
                <li>
                  fill in your student number and name{' '}
                  <Link to="/myinfo"> here </Link> if you want to get the
                  University of Helsinki credits.
                </li>
              </ul>
            </div>
          }
        />
      </div>
    )
  }

  const text = getButtonText(completed, sure)

  return (
    <Form>
      {languageSelect}

      {!completed && <HasEnrolledWidget />}

      <Button
        type="button"
        onClick={handleToggleCompleted}
        disabled={disabled}
        color={sure ? 'orange' : 'vk'}
      >
        {text}
      </Button>
    </Form>
  )
}
export default CompletedForm
