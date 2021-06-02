import React from 'react'

import SuotarPayload from '../SuotarPayload'

const needsCreditsFromParts0to7 = (s) => {
  const { creditsParts0to7 } = s
  console.log(s)


  const creditsInOodi = s.courseProgress.grading
    ? s.courseProgress.grading.credits || 0
    : 0
  return creditsParts0to7 > creditsInOodi
}

const needs5Credits = (s) => {
  const creditsInOodi = s.courseProgress.grading
    ? s.courseProgress.grading.credits || 0
    : 0

  return creditsInOodi === 0
}

const needs6ThCredit = (s) => {
  const { creditsParts0to7 } = s

  const creditsInOodi = s.courseProgress.grading
    ? s.courseProgress.grading.credits || 0
    : 0

  return creditsParts0to7 > 5 && creditsInOodi < 6
}

const needs7ThCredit = (s) => {
  const { creditsParts0to7 } = s

  const creditsInOodi = s.courseProgress.grading
    ? s.courseProgress.grading.credits || 0
    : 0

  return creditsParts0to7 > 6 && creditsInOodi < 7
}

const f = (grade) => (grade === 'hyväksytty/accepted' ? 'Hyv.' : grade)

const FullstackSuotarDump = ({ students }) => {
  // student number;grade;credits;language;date
  const suotarFriendlyCompleted = (completed) => {
    const date = new Date(completed)
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }

  const suotarString = students
    .filter(needs5Credits)
    .map(
      (stud) =>
        `${stud.studentNumber};${f(stud.grade)};${5},0;${
          stud.language || ''
        };${suotarFriendlyCompleted(stud.completed)}`,
    )
    .join('\n')

    const suotarStringExtension1 = students
    .filter(needs6ThCredit)
    .map(
      (stud) =>
        `${stud.studentNumber};Hyv.;1,0;${
          stud.language || ''
        };${suotarFriendlyCompleted(stud.completed)}`,
    )
    .join('\n')

    const suotarStringExtension2 = students
    .filter(needs7ThCredit)
    .map(
      (stud) =>
        `${stud.studentNumber};Hyv.;1,0;${
          stud.language || ''
        };${suotarFriendlyCompleted(stud.completed)}`,
    )
    .join('\n')

  return (
    <div style={{ float: 'right' }}>
      {suotarString ? (
        <>
          <h3>for suotar</h3>
          <SuotarPayload payload={suotarString} />
        </>
      ) : null}

      {suotarStringExtension1 ? (
        <>
          <h3>extension 1</h3>
          <SuotarPayload payload={suotarStringExtension1} />
        </>
      ) : null}

      {suotarStringExtension2 ? (
        <>
          <h3>extension 2</h3>
          <SuotarPayload payload={suotarStringExtension2} />
        </>
      ) : null}
    </div>
  )
}

export default FullstackSuotarDump
