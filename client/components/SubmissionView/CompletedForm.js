import React, { useEffect, useState } from 'react'
import { Button, Form, Message, Checkbox } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

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

import examService from 'Services/exam'

import HasEnrolledWidget from 'Components/HasEnrolledWidget'

import { nextTry } from 'Components/ExamView'

const getConfirmText = (courseName, submissions) => {
  const credits = getCourseCredits(courseName, submissions)
  const grade = getCourseGrade(courseName, submissions)

  return getCourseCompletionConfirmation(courseName, { grade, credits })
}

const getButtonText = (completed, sure) => {
  if (!completed && !sure) {
    return 'I have completed the course (and will not do more exercises) and want to get university credits registered'
  }
  if (!completed && sure) {
    return 'Press again to confirm. Make sure that everything is ready and submitted'
  }
  if (completed && !sure) {
    return 'If you want to continue the course (do more exercises for this part), press here'
  }
  if (completed && sure) {
    return 'Press again to continue the course'
  }
}

const selectCompletionInfo = ({ course, user }) => {
  const courseName = (course.info || {}).name

  const { completed, oodi } =
    ((user || {}).courseProgress || []).find(
      (c) => c.courseName === courseName,
    ) || {}

  const submissions = user.submissions.filter(
    (sub) => sub.courseName === courseName,
  )

  const confirmText = getConfirmText(courseName, submissions)
  const credits = getCourseCredits(courseName, submissions)
  return { completed, courseName, confirmText, user, oodi, credits }
}

const languageNameByCode = {
  fi: 'Finnish',
  en: 'English',
}

const CompletedForm = ({ courseCompleted, history }) => {
  const { completed, courseName, confirmText, user, oodi, credits } =
    useSelector(selectCompletionInfo)

  const [examStatus, setStatusDone] = useState({ passed: false })

  useEffect(() => {
    examService.getExamStatus(user.id).then(({ passed, endtime }) => {
      setStatusDone({ passed, endtime })
    })
  }, [])

  const completionLanguages = getCourseCompletionLanguages(courseName)

  const dispatch = useDispatch()
  const [sure, setSure] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [language, setLanguage] = useState(completionLanguages[0])
  const [registered, setRegistered] = useState(completed)

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
                  Enroll to the Open Universty course{' '}
                  <a href="https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-861c248f-e4e4-43df-a69a-50fd206afabf">
                    here
                  </a>
                </li>
                <li>
                  Fill in your student number and name{' '}
                  <Link to="/myinfo"> here </Link> if you want to get the
                  University of Helsinki credits
                </li>
                <li>
                  Do the exam in here in the submission system (after the two
                  above steps)
                </li>
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
                  University of Helsinki credits
                </li>
              </ul>
            </div>
          }
        />
      </div>
    )
  }

  const text = getButtonText(completed, sure)

  const label =
    'I have registered to the university course according to the information given in the course page'

  const examNotDone = !examStatus.passed

  if (examNotDone && courseName === 'ofs2019') {
    const canBeTried = nextTry(examStatus.endtime)

    const today = moment()

    if (examStatus.endtime && !today.isAfter(canBeTried)) {
      return (
        <div>
          <h4>University of Helsinki credits</h4>

          <p>
            If you want to get the university credits, you should do the exam.
            If you have already done the exam in Moodle, please contact
            matti.luukkainen@helsinki.fi or @mluukkai in Discord
          </p>

          <p>
            You tried the exam{' '}
            {moment(examStatus.endtime).format('MMMM Do YYYY HH:mm:ss')} but
            failed
          </p>
          <p>
            You can do the exam again{' '}
            {canBeTried.format('HH:mm:ss  MMMM Do YYYY')}
          </p>
        </div>
      )
    }

    const color = sure ? 'orange' : 'vk'

    return (
      <div>
        <h4>University of Helsinki credits</h4>

        <p>
          If you want to get the university credits, you should do the exam. If
          you have already done the exam in Moodle, please contact
          matti.luukkainen@helsinki.fi or @mluukkai in Discord
        </p>
        <Button
          type="button"
          onClick={() => history.push(`/courses/${courseName}/exam`)}
          color={color}
        >
          Start the exam now
        </Button>
      </div>
    )
  }

  const whenCompleted = () => {
    if (!completed) return null

    const registrationStatus = oodi
      ? 'University credits registered, see the course page how to get a transcript if you need one'
      : ' University credit registration in progress. Note that this is a manual step that may take up to 4 weeks to be completed!'

    const color = sure ? 'orange' : 'grey'

    return (
      <div>
        <div>{registrationStatus}</div>

        {courseName === 'ofs2019' && oodi && (
          <Button
            style={{ marginTop: 20 }}
            type="button"
            onClick={handleToggleCompleted}
            disabled={disabled || !registered}
            color={color}
          >
            {text}
          </Button>
        )}
      </div>
    )
  }

  return (
    <Form>
      <h4>University of Helsinki credits</h4>

      {examStatus && examStatus.passed && courseName.includes('ofs') && (
        <div style={{ marginBottom: 10 }}>
          Exam passed{' '}
          {moment(examStatus.endtime).format('HH:mm:ss  MMMM Do YYYY')}
        </div>
      )}

      {!completed && languageSelect}

      {!completed && <HasEnrolledWidget />}

      {examStatus && examStatus.passed && courseName.includes('ofs') && (
        <div style={{ marginBottom: 15 }}>
          If you do not yet have university enrollments for the course
          <ul>
            <li>
              do it{' '}
              <a href="https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-861c248f-e4e4-43df-a69a-50fd206afabf">
                here
              </a>{' '}
              for the base part (5 credits)
            </li>
            {credits > 5 && (
              <li>
                <a href="https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-de83e85f-a06e-4258-ad8c-30326d76228e">
                  here
                </a>{' '}
                for the extension 1 (1 credits)
              </li>
            )}
            {credits > 6 && (
              <li>
                and{' '}
                <a href="https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-53ccca2f-8e77-47e3-931a-63f9d5c8cc2e">
                  here
                </a>{' '}
                for the extension 2 (1 credits)
              </li>
            )}
          </ul>
          <div>
            Note that without all necessary enrolments, the credits will not be
            registered!
          </div>
        </div>
      )}

      {!completed && (
        <Form.Field>
          <Checkbox onClick={() => setRegistered(!registered)} label={label} />
        </Form.Field>
      )}

      {whenCompleted()}

      {!completed && (
        <Button
          type="button"
          onClick={handleToggleCompleted}
          disabled={disabled || !registered}
          color={sure ? 'orange' : 'vk'}
        >
          {text}
        </Button>
      )}
    </Form>
  )
}

export default withRouter(CompletedForm)
