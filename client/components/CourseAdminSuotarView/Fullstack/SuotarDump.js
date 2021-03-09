import React from 'react'

import SuotarPayload from '../SuotarPayload'

const needsCreditsFromParts0to7 = (s) => {
  const { creditsFromParts0to7 } = s
  const creditsInOodi = s.courseProgress.grading
    ? s.courseProgress.grading.credits
    : 0
  return creditsFromParts0to7 > creditsInOodi
}

const f = (grade) => (grade === 'hyväksytty/accepted' ? 'Hyv.' : grade)

const FullstackSuotarDump = ({ students }) => {
  // student number;grade;credits;language;date
  const suotarFriendlyCompleted = (completed) => {
    const date = new Date(completed)
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }

  const suotarString = students
    .filter(needsCreditsFromParts0to7)
    .map(
      (stud) =>
        `${stud.studentNumber};${f(stud.grade)};${stud.creditsParts0to7},0;${
          stud.language || ''
        };${suotarFriendlyCompleted(stud.completed)}`,
    )
    .join('\n')

  const suotarStringTypeScript = students
    .filter((stud) => stud.creditsPart9 > 0)
    .map(
      (stud) =>
        `${stud.studentNumber};Hyv.;${stud.creditsPart9},0;;${suotarFriendlyCompleted(
          stud.completed,
        )}`,
    )
    .join('\n')

  const suotarStringGraphql = students
    .filter((stud) => stud.creditsPart8 > 0)
    .map(
      (stud) =>
        `${stud.studentNumber};Hyv.;${stud.creditsPart8},0;${
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

      {suotarStringGraphql ? (
        <>
          <h3>part 8</h3>
          <SuotarPayload payload={suotarStringGraphql} />
        </>
      ) : null}

      {suotarStringTypeScript ? (
        <>
          <h3>part 9</h3>
          <SuotarPayload payload={suotarStringTypeScript} />
        </>
      ) : null}
    </div>
  )
}

export default FullstackSuotarDump
