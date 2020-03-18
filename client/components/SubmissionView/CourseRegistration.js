import React from 'react'
import { useSelector } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import { submissionsToFullstackGradeAndCredits } from 'Utilities/common'
import CertificateLink from 'Components/SubmissionView/CertificateLink'
import ExamInfo from 'Components/SubmissionView/ExamInfo'
import CompletedButton from 'Components/SubmissionView/CompletedButton'

const CourseRegistration = () => {
  const { user, grade, credits, courseName } = useSelector(({ user, course }) => {
    const courseName = ((course || {}).info || {}).name
    if (courseName !== 'ofs2019') return { courseName }
    const submissions = user.submissions.filter(sub => sub.courseName === courseName)
    const [grade, credits] = submissionsToFullstackGradeAndCredits(submissions)
    return {
      grade,
      credits,
      user,
      courseName,
    }
  })
  if (courseName !== 'ofs2019') return null

  const courseProgress = (user.courseProgress || []).find(c => c.courseName === courseName)

  const prettyCompleted = (date) => {
    const dd = new Date(date)
    return `Course marked as completed ${dd.getDate()}.${dd.getMonth() + 1} ${dd.getFullYear()}`
  }

  if (!courseProgress) return null
  const certRandom = courseProgress.random
  return (
    <Segment>
      {(user && courseProgress.completed) && (
        <div style={{ paddingTop: 10 }}>
          <strong>
            {prettyCompleted(courseProgress.completed)}
          </strong>
        </div>
      )}
      <ExamInfo
        grade={grade}
        credits={credits}
        courseProgress={courseProgress}
      />
      <CertificateLink
        credits={credits}
        certRandom={certRandom}
        name={user.name}
      />
      <CompletedButton />
    </Segment>
  )
}

export default CourseRegistration
