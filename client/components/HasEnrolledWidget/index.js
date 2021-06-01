import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Popup, Message } from 'semantic-ui-react'

import { callApi } from 'Utilities/apiConnection'

const HasEnrolledWidget = () => {
  const { studentNumber, checkCodesArray, course } = useSelector(({ user, course }) => {
    const submissions = user.submissions.filter(
      (sub) => sub.courseName === course.info.name,
    )
    const checkCodesArray = course.info.enrolmentCheckData.filter((check) =>
      submissions.find((s) => s.week === check.weekNumber),
    )
    return {
      studentNumber: user.student_number,
      checkCodesArray,
      course
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

  const fs = course.info.name.includes('fs-') || course.info.name.includes('ofs')
  const message = fs ? 'Read carefully the information from the coursepage ' : 'To get your credits enrol in the course! '

  const toPage = (enrolmentLink) => {
    const parts = enrolmentLink.split(' ')
    if (parts.length < 2) {
      return <a href={enrolmentLink}>{enrolmentLink}</a>
    }
    
    return(
      <ul>
        <li><a href={parts[0]}>{parts[0]}</a></li>
        <li><a href={parts[1]}>{parts[1]}</a></li>
      </ul>
    )
    
  }

  return (
    <>
      {missingEnrolments.map(({ code, enrolmentLink }) => (
        <Popup
          basic
          content="This message may be wrong, if you are certain you have enrolled for the course you may ignore it."
          trigger={
            <Message 
              header={`In order to get the credits you should be enrolled in the course ${code}`}
              content={
                <div style={{ marginTop: 10 }}>
                  {message}
                  {toPage(enrolmentLink)}
                </div>
              }
            />
          }
        />
      ))}
    </>
  )
}

export default HasEnrolledWidget
