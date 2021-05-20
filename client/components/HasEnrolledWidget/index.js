import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Popup, Message } from 'semantic-ui-react'

import { callApi } from 'Utilities/apiConnection'

const HasEnrolledWidget = () => {
  const { user, courseCode } = useSelector(({ user, course }) => ({
    user,
    courseCode: course.info.code,
  }))
  const [hasEnrolled, setHasEnrolled] = useState(undefined)

  const checkEnrolment = async () => {
    if (!courseCode) return

    const { data: enrolmentStatus } = await callApi(
      `/users/enrolment_status/${courseCode}`,
    )
    setHasEnrolled(enrolmentStatus)
  }

  useEffect(() => {
    if (!user.student_number) return

    checkEnrolment()
  }, [user.student_number])

  if (!courseCode) return null

  // Only show reminder to enrol to the course if student certainly has not enrolled
  if (hasEnrolled !== false) return null

  return (
    <Popup
      basic
      content="This message may be wrong, if you are certain you have enrolled for the course you may ignore it."
      trigger={(
        <Message
          header="It seems you have not enrolled to this course yet."
          content="To get your credits remember to enrol for the course!"
        />
      )}
    />
  )
}

export default HasEnrolledWidget
