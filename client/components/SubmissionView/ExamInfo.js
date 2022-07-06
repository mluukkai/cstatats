import React from 'react'

const ExamInfo = ({ courseProgress }) => {
  if (!courseProgress) return null
  const e1 = (courseProgress.grading || {}).exam1
  const e2 = (courseProgress.grading || {}).exam2
  if (!e1 || !e2) return null

  console.log('js')

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
      )}
      {status(e2).length > 0 && (
        <div style={{ paddingTop: 10 }}>
          <strong style={{ paddingRight: 3 }}>Exam 2</strong> {status(e2)}
        </div>
      )}
    </div>
  )
}

export default ExamInfo
