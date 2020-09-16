import React, { useState } from 'react'
import { Table, Button } from 'semantic-ui-react'

const CompletedAndMarkedUsersList = ({ students, revertOodi }) => {
  const [show, setShow] = useState(false)

  if (!show)
    return (
      <Button type="button" onClick={() => setShow(true)}>
        Show marked
      </Button>
    )
  return (
    <>
      <Button type="button" onClick={() => setShow(false)}>
        Hide marked
      </Button>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Number</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Completed</Table.HeaderCell>
            <Table.HeaderCell>Credits</Table.HeaderCell>
            <Table.HeaderCell>Grade</Table.HeaderCell>
            <Table.HeaderCell>Revert Oodi</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {students.map(
            ({ studentNumber, name, username, completed, credits, grade }) => (
              <Table.Row key={username}>
                <Table.Cell>{studentNumber}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{username}</Table.Cell>
                <Table.Cell>
                  {new Date(completed).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{credits}</Table.Cell>
                <Table.Cell>{grade}</Table.Cell>
                <Table.Cell
                  style={{ cursor: 'pointer', backgroundColor: 'whitesmoke' }}
                  onClick={revertOodi(username)}
                />
              </Table.Row>
            ),
          )}
        </Table.Body>
      </Table>
    </>
  )
}

export default CompletedAndMarkedUsersList
