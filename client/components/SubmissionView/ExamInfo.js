import React from 'react'

const ExamInfo = ({ grade, credits, courseProgress }) => {
  if (!courseProgress) return null
  const e1 = (courseProgress.grading || {}).exam1
  const e2 = (courseProgress.grading || {}).exam2
  if (!e1 || !e2) return null

  const status = (e) => {
    if (e.graded) return 'passed'
    if (e.done) return 'done'

    return ''
  }

  return (
    <div>
      {status(e1).length > 0 && (
        <div style={{ paddingTop: 10 }}>
          <strong style={{ paddingRight: 3 }}>Exam 1</strong> {status(e1)}
        </div>
      )
      }
      {status(e2).length > 0 && (
        <div style={{ paddingTop: 10 }}>
          <strong style={{ paddingRight: 3 }}>Exam 2</strong> {status(e2)}
        </div>
      )}

      <div style={{ paddingTop: 10, paddingRight: 5 }}>
        <strong style={{ paddingRight: 3 }}>grade</strong>
        {grade}
        <strong style={{ paddingRight: 3, paddingLeft: 6 }}>credits</strong>
        <span style={{ paddingRight: 8 }}>{credits}</span>
        <em>based on exercises</em>
      </div>
    </div>
  )
}

export default ExamInfo
