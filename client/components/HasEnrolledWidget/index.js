import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Popup, Message } from 'semantic-ui-react'

import { callApi } from 'Utilities/apiConnection'

const HasEnrolledWidget = () => {
  const { studentNumber, checkCodesArray } = useSelector(({ user, course }) => {
    const submissions = user.submissions.filter(
      (sub) => sub.courseName === course.info.name,
    )
    const checkCodesArray = course.info.enrolmentCheckData.filter((check) =>
      submissions.find((s) => s.week === check.weekNumber),
    )
    return {
      studentNumber: user.student_number,
      checkCodesArray,
    }
  })
  const [missingEnrolments, setMissingEnrolments] = useState(checkCodesArray)

  const checkEnrolment = async () => {
    const newMissingEnrolments = []
    // eslint-disable-next-line
    for (const checkData of checkCodesArray) {
      // eslint-disable-next-line
      const { data: enrolmentStatus } = await callApi(
        `/users/enrolment_status/${checkData.code}`,
      )

      if (enrolmentStatus === true) return

      newMissingEnrolments.push(checkData)
    }

    setMissingEnrolments(newMissingEnrolments)
  }

  useEffect(() => {
    if (!studentNumber) return

    checkEnrolment()
  }, [studentNumber])

  if (!studentNumber) return null
  if (!missingEnrolments.length) return null

  return (
    <>
      {missingEnrolments.map(({ code, enrolmentLink }) => (
        <Popup
          basic
          content="This message may be wrong, if you are certain you have enrolled for the course you may ignore it."
          trigger={
            <Message
              header={`Remember to enrol in the course ${code}.`}
              content={
                <span>
                  To get your credits enrol in the course!{' '}
                  <a href={enrolmentLink}>{enrolmentLink}</a>
                </span>
              }
            />
          }
        />
      ))}
    </>
  )
}

export default HasEnrolledWidget
