import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'

import adminService from 'Services/admin'
import SuotarPayload from '../SuotarPayload'

const suotarFriendlyCompleted = (completed) => {
  const date = new Date(completed)
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

const SuotarDump = ({ students, courseName }) => {
  //const name = ['fs-typescript', 'fs-graphql', 'fs-cicd'].includes(courseName) ? `;${courseName}` : ''

  const [mangeled, setMangeled] = useState(null)

  const suotarString = students
    .map(
      (stud) =>
        `${stud.studentNumber};Hyv.;${stud.credits},0;${
          stud.language || ''
        };${suotarFriendlyCompleted(stud.completed)};${courseName}`,
    )
    .join('\n')

  const mangel = async () => {
    const data = await adminService.suotarMangel(
      { string: suotarString },
      courseName,
    )
    setMangeled(data)
  }

  if (!suotarString) return null

  return (
    <div>
      <h3>for suotar</h3>
      <SuotarPayload payload={suotarString} />

      <div style={{ marginTop: 20 }} />

      <Button type="button" onClick={mangel}>
        do mankeli
      </Button>

      <div style={{ marginTop: 20 }} />

      {mangeled && <pre>{mangeled}</pre>}
    </div>
  )
}

export default SuotarDump
