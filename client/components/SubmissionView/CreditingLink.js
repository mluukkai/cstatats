import React from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const CreditingLink = () => {
  const { submissions, courseName, extension } = useSelector(({ user, course }) => {
    const courseName = course.info.name
    return {
      submissions: user.submissions.filter(s => s.courseName === courseName),
      courseName,
      extension: course.info.extension,
    }
  })
  if (!submissions || !extension || submissions.length) return null

  return (
    <Button fluid style={{ margin: '1em' }}>
      <Link to={`/courses/${courseName}/crediting`}>
        Click here if you have already completed a part of the course and wish to continue right where you left off!
      </Link>
    </Button>
  )
}

export default CreditingLink
