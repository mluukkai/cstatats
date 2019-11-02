import React from 'react'
import { Segment, Button } from 'semantic-ui-react'

const LogInAsBar = () => {
  const loggedInAs = localStorage.getItem('adminLoggedInAs')

  if (!loggedInAs) return null

  const clearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <Segment inverted>
      <span style={{ paddingRight: '2em' }}>
        You are now logged in as {loggedInAs}.
      </span>
      <Button inverted color="red" onClick={clearStorage}>Click me to return to yourself </Button>
    </Segment>
  )
}

export default LogInAsBar
