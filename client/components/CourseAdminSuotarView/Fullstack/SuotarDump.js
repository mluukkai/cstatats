import React from 'react'
import copy from 'copy-to-clipboard'

const FullstackSuotarDump = ({ students }) => {
  // student number;grade;credits;language;date
  const suotarFriendlyCompleted = (completed) => {
    const date = new Date(completed)
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }

  const f = (grade) => (grade === 'hyväksytty/accepted' ? 'Hyv.' : grade)

  const needsCreditsFromParts0to8 = (s) => {
    const creditsFromParts0to8 = s.creditsParts0to8
    const creditsInOodi = s.courseProgress.grading
      ? s.courseProgress.grading.credits
      : 0
    return creditsFromParts0to8 > creditsInOodi
  }

  const suotarString = students
    .filter(needsCreditsFromParts0to8)
    .map(
      (stud) =>
        `${stud.studentNumber};${f(stud.grade)};${stud.creditsParts0to8},0;${
          stud.language || ''
        };${suotarFriendlyCompleted(stud.completed)}`,
    )
    .join('\n')

  const suotarStringTypeScript = students
    .filter((stud) => stud.part9)
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
          <div>
            {suotarString.split('\n').map((val) => (
              <span key={val}>
                {val} <br />{' '}
              </span>
            ))}
            <button onClick={() => copy(suotarString)}>
              Copy to Clipboard
            </button>
          </div>
        </>
      ) : null}
      {suotarStringTypeScript ? (
        <>
          <h3>part 9</h3>
          <div>
            {suotarStringTypeScript.split('\n').map((val) => (
              <span key={val}>
                {val} <br />{' '}
              </span>
            ))}
            <button onClick={() => copy(suotarStringTypeScript)}>
              Copy to Clipboard
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default FullstackSuotarDump
