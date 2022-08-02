import React, { useState } from 'react'
import { Button, Loader } from 'semantic-ui-react'

import adminService from 'Services/admin'
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
  const [mangeled, setMangeled] = useState(null)
  const [loading, setLoading] = useState(null)

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
        };${suotarFriendlyCompleted(stud.completed)};fs`,
    )
    .join('\n')

  const suotarStringExtension1 = students
    .filter(needs6ThCredit)
    .map(
      (stud) =>
        `${stud.studentNumber};Hyv.;1,0;${
          stud.language || ''
        };${suotarFriendlyCompleted(stud.completed)};ext1`,
    )
    .join('\n')

  const suotarStringExtension2 = students
    .filter(needs7ThCredit)
    .map(
      (stud) =>
        `${stud.studentNumber};Hyv.;1,0;${
          stud.language || ''
        };${suotarFriendlyCompleted(stud.completed)};ext2`,
    )
    .join('\n')

  const mangel = async () => {
    const theString = `${suotarString}\n${suotarStringExtension1}\n${suotarStringExtension2}`

    setLoading(true)
    const data = await adminService.suotarMangel({ string: theString }, 'ofs19')
    setMangeled(data)

    setLoading(false)
  }

  const forSuotar =
    suotarString || suotarStringExtension1 || suotarStringExtension2

  return (
    <div>
      {!mangeled && forSuotar && (
        <div>
          <h3>raw suotar strings</h3>
          {suotarString ? (
            <>
              <SuotarPayload payload={suotarString} noPasteButton />
            </>
          ) : null}

          {suotarStringExtension1 ? (
            <>
              <SuotarPayload payload={suotarStringExtension1} noPasteButton />
            </>
          ) : null}

          {suotarStringExtension2 ? (
            <>
              <SuotarPayload payload={suotarStringExtension2} noPasteButton />
            </>
          ) : null}
        </div>
      )}

      {!mangeled && !loading && forSuotar && (
        <Button type="button" onClick={mangel}>
          do mankeli
        </Button>
      )}
      {loading && (
        <div>
          <Loader active inline />
          <span style={{ padding: 10 }}>pls wait for the mangel...</span>
          <Loader active inline />
        </div>
      )}
      <div style={{ marginTop: 20 }} />
      {mangeled && (
        <div>
          <h3>acual suotar entries</h3>
          <pre>{mangeled}</pre>
        </div>
      )}
    </div>
  )
}

export default FullstackSuotarDump
