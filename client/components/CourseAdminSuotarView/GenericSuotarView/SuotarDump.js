import React, { useState } from 'react'
import { Button, Loader, Input, Table } from 'semantic-ui-react'

import adminService from 'Services/admin'
import SuotarPayload from '../SuotarPayload'

const suotarFriendlyCompleted = (completed) => {
  const date = new Date(completed)
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

const SuotarDump = ({ students, courseName }) => {
  const [mangeled, setMangeled] = useState(null)
  const [loading, setLoading] = useState(null)
  const [email, setEmail] = useState(false)
  const [inSisu, setInSisu] = useState(null)
  const [all, setAll] = useState(false)

  const suotarString = students
    .map(
      (stud) =>
        `${stud.studentNumber};Hyv.;${stud.credits},0;${
          stud.language || ''
        };${suotarFriendlyCompleted(stud.completed)};${courseName}`,
    )
    .join('\n')

  const mangel = async () => {
    setLoading(true)
    const data = await adminService.suotarMangel(
      { string: suotarString, email },
      courseName,
    )
    setMangeled(data)
    setLoading(false)
  }

  const sisu = async () => {
    const ok = window.confirm('Send attainments to SISU?')
    if (!ok) {
      return
    }
    setLoading(true)

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

    const data = await adminService.dumpSisu({ mangeled: payload, courseName })
    setLoading(false)
    setInSisu(data)
  }

  if (!suotarString) return null

  return (
    <div>
      {!mangeled && (
        <div>
          <h3>raw suotar entries</h3>
          <SuotarPayload payload={suotarString} noPasteButton />
          <div style={{ marginTop: 20 }} />
        </div>
      )}

      {!mangeled && !loading && (
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
        <>
          <div>
            <h3>
              acual suotar entries{' '}
              <i>({email ? 'emails were sent' : 'emails were not send'})</i>
            </h3>

            <pre>{mangeled}</pre>
          </div>
          {!inSisu && (
            <div>
              <Button type="button" onClick={sisu} color="red">
                Send attainments to Sisu
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
                missing enrolments:{' '}
                {inSisu.data.isMissingEnrollment ? 'yes' : 'no'}
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
                          {row.entry.missingEnrolment ? 'not enrolled' : ''}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SuotarDump
