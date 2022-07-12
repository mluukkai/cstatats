import React, { useState, useEffect } from 'react'
import { Table, Button } from 'semantic-ui-react'
import examService from 'Services/exam'

const AdminExceptionExamView = () => {
  const [excetpions, setExcetpions] = useState([])
  const [id, setId] = useState('')

  useEffect(() => {
    examService.getExceptions().then((excetpions) => {
      setExcetpions(excetpions)
    })
  }, [])

  const addException = async (e) => {
    e.preventDefault()
    const newException = await examService.createException({
      studentId: id,
      passed: true,
      beta: false,
    })
    setExcetpions(excetpions.concat(newException))
    setId('')
  }

  const addBeta = async (e) => {
    e.preventDefault()
    const newException = await examService.createException({
      studentId: id,
      passed: false,
      beta: true,
    })
    setExcetpions(excetpions.concat(newException))
    setId('')
  }

  const removeException = async (id) => {
    const ok = window.confirm('sure?')
    if (ok) {
      await examService.deleteException(id)
      setExcetpions(excetpions.filter((e) => e._id !== id))
    }
  }

  const changeName = ({ target }) => {
    setId(target.value)
  }

  return (
    <div>
      <h2>Exceptions</h2>

      <form onSubmit={addException}>
        <input type="text" value={id} onChange={changeName} />
        <button type="submit">add</button>
      </form>

      <Table celled striped compact>
        <Table.Body>
          {excetpions
            .filter((e) => e.passed)
            .map((e) => (
              <Table.Row key={e._id}>
                <Table.Cell>{e.user.student_number}</Table.Cell>
                <Table.Cell>{e.user.name}</Table.Cell>
                <Table.Cell>{e.user.username}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => removeException(e._id)}>delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>

      <h2>Beta</h2>

      <form onSubmit={addBeta}>
        <input type="text" value={id} onChange={changeName} />
        <button type="submit">add</button>
      </form>

      <Table celled striped compact>
        <Table.Body>
          {excetpions
            .filter((e) => e.beta)
            .map((e) => (
              <Table.Row key={e._id}>
                <Table.Cell>{e.user.student_number}</Table.Cell>
                <Table.Cell>{e.user.name}</Table.Cell>
                <Table.Cell>{e.user.username}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => removeException(e._id)}>delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default AdminExceptionExamView
