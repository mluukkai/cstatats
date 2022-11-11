import React, { useState } from 'react'
import { Button, Loader, Input, Table } from 'semantic-ui-react'

import adminService from 'Services/admin'
import SuotarPayload from '../SuotarPayload'

const needsCreditsFromParts0to7 = (s) => {
  const { creditsParts0to7 } = s

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
  const [email, setEmail] = useState(false)
  const [inSisu, setInSisu] = useState(null)
  const [all, setAll] = useState(false)

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
    const data = await adminService.suotarMangel(
      { string: theString, email },
      'ofs19',
    )

    setMangeled(data)

    setLoading(false)
  }

  const sisu = async () => {
    const splitted = mangeled.split('\n')
    const selected = all ? splitted : []

    if (!all) {
      for (let i = 0; i < splitted.length; i++) {
        const row = splitted[i]
        if (row.length === 0) break
        selected.push(row)
      }
    }

    const payload = selected.filter((r) => r.startsWith('01')).join('\n')

    if (payload.length === 0) {
      alert('nothing to dump...')
      return
    }
    const ok = window.confirm('Send attainments to SISU?')
    if (!ok) {
      return
    }
    setLoading(true)

    const data = await adminService.dumpSisu({
      mangeled: payload,
      courseName: 'ofs19',
    })
    setLoading(false)
    setInSisu(data)
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
        <div>
          <Button type="button" onClick={mangel}>
            do mankeli
          </Button>
          <span style={{ marginLeft: 10, marginRight: 5 }}>
            send email if missing ilmo
          </span>
          <Input
            checked={email}
            onChange={({ target }) => setEmail(target.checked)}
            type="checkbox"
          />
        </div>
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
          <h3>
            acual suotar entries{' '}
            <i>({email ? 'emails were sent' : 'emails were not send'})</i>
          </h3>
          <pre>{mangeled}</pre>
        </div>
      )}

      {mangeled && !inSisu && (
        <div>
          <Button type="button" onClick={sisu} color="red">
            Send attainments to SISU
          </Button>
          <span style={{ marginLeft: 10, marginRight: 5 }}>
            also unregistered
          </span>
          <Input
            checked={all}
            onChange={({ target }) => setAll(target.checked)}
            type="checkbox"
          />
        </div>
      )}
      {inSisu && (
        <div
          style={{
            marginTop: 10,
            marginBottom: 10,
            padding: 10,
            borderStyle: 'solid',
          }}
        >
          <h3>SISU DUMP</h3>
          <div>status: {inSisu.status}</div>
          <div>
            missing enrolments: {inSisu.data.isMissingEnrollment ? 'yes' : 'no'}
          </div>
          <div>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell>date</Table.HeaderCell>
                  <Table.HeaderCell>code</Table.HeaderCell>
                  <Table.HeaderCell>course</Table.HeaderCell>
                  <Table.HeaderCell>grade</Table.HeaderCell>
                  <Table.HeaderCell>credits</Table.HeaderCell>
                  <Table.HeaderCell>enrolled</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {inSisu.data.rows.map((row) => (
                  <Table.Row key={row.id}>
                    <Table.Cell>{row.studentNumber}</Table.Cell>
                    <Table.Cell>{row.entry.studentName}</Table.Cell>
                    <Table.Cell>{row.attainmentDate}</Table.Cell>
                    <Table.Cell>{row.course.code}</Table.Cell>
                    <Table.Cell>{row.course.name}</Table.Cell>
                    <Table.Cell>{row.grade}</Table.Cell>
                    <Table.Cell>{row.credits}</Table.Cell>
                    <Table.Cell>
                      {row.entry.missingEnrolment ? (
                        <span style={{ color: 'red' }}>not enrolled</span>
                      ) : (
                        'yes'
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

export default FullstackSuotarDump
