import React, { useState } from 'react'
import { Button, Loader } from 'semantic-ui-react'

import adminService from 'Services/admin'
import SuotarPayload from '../SuotarPayload'

const suotarFriendlyCompleted = (completed) => {
  const date = new Date(completed)
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

const SuotarDump = ({ students, courseName }) => {
  //const name = ['fs-typescript', 'fs-graphql', 'fs-cicd'].includes(courseName) ? `;${courseName}` : ''

  const [mangeled, setMangeled] = useState(null)
  const [loading, setLoading] = useState(null)

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
      { string: suotarString },
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

export default SuotarDump
