import React, { useState } from 'react'
import { Button, Loader, Input } from 'semantic-ui-react'

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

  const suotarString = students
    .map(
      (stud) =>
        `${stud.studentNumber};${stud.grade};${stud.credits},0;${
          stud.language || 'fi'
        };${suotarFriendlyCompleted(stud.completed)};TKT21003`,
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
        <div>
          <h3>
            acual suotar entries{' '}
            <i>({email ? 'emails were sent' : 'emails were not send'})</i>
          </h3>

          <pre>{mangeled}</pre>
        </div>
      )}
    </div>
  )
}

export default SuotarDump
