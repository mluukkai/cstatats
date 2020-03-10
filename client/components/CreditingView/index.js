import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Form, Input, Dropdown, Table, Button,
} from 'semantic-ui-react'
import { createExtension } from 'Utilities/redux/userReducer'
import { clearNotification } from 'Utilities/redux/notificationReducer'

const Crediting = () => {
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))
  const dispatch = useDispatch()
  const [newExtension, setNewExtension] = useState({
    fromCourse: '',
    toWeek: '',
    fromUsername: user.username,
  })
  const { fromCourse, toWeek, fromUsername } = newExtension
  const handleChange = (_, { id, value }) => setNewExtension({ ...newExtension, [id]: value })

  const formValid = () => fromUsername.length > 2
    && !fromUsername.includes('/')
    && fromCourse.length > 1
    && toWeek.length

  const createCrediting = async () => {
    const payload = { fromUsername, fromCourse, toWeek }

    try {
      await dispatch(createExtension(course.info.name, payload))
    } catch (error) {
      // Don't care
    }
    setTimeout(() => { dispatch(clearNotification()) }, 8000)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = window.confirm('Are you absolutely sure that you gave the right info? ')
    if (ok) createCrediting()
  }
  if (!user) return null

  const extension = user.extensions && user.extensions.find(e => e.to === course || e.courseName === course)

  if (extension) {
    const submissions = extension.extendsWith
    const total = submissions.reduce((s, e) => s + e.exercises, 0)

    return (
      <div>
        <h2>Crediting</h2>

        <em>
          Credited the following parts from course
          {extension.from}
        </em>

        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>part</Table.HeaderCell>
              <Table.HeaderCell>exercises</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {submissions.map(s => (
              <Table.Row key={s.part}>
                <Table.Cell>{s.part}</Table.Cell>
                <Table.Cell>{s.exercises}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>total</Table.HeaderCell>
              <Table.HeaderCell>{total}</Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>

      </div>
    )
  }

  const stateOptions = [
    { key: '0', value: '0', text: '0' },
    { key: '1', value: '1', text: '1' },
    { key: '2', value: '2', text: '2' },
    { key: '3', value: '3', text: '3' },
    { key: '4', value: '4', text: '4' },
    { key: '5', value: '5', text: '5' },
    { key: '6', value: '6', text: '6' },
  ]
  const courseOptions = [
    {
      key: 'fullstackopen2018',
      value: 'fullstackopen2018',
      text: 'fullstackopen2018: Open university course',
    },
    {
      key: 'fullstack 2018',
      value: 'fullstack2018',
      text: 'fullstack2018: Department of CS course',
    },
  ]

  return (
    <div>
      <h2>Crediting a previous course (hyväksiluku)</h2>
      <p>Täytä allaoleva lomake ainoastaan, jos aiot tällä kurssilla täydentää aiempaa kurssisuoritustasi.</p>

      <p>
        Hyväksiluvusta lisää
        {' '}
        <a href="https://fullstack-hy2019.github.io/osa0/yleista#aiemmin-suoritetun-kurssin-taydentaminen">kurssisivulta</a>
        .
      </p>
      <Form onSubmit={handleSubmit}>
        <Form.Field inline>
          <label>From course</label>
          <Dropdown
            inline
            options={courseOptions}
            value={fromCourse}
            id="fromCourse"
            onChange={handleChange}
          />
        </Form.Field>

        <Form.Field inline>
          <label>Parts from 0 to</label>
          <Dropdown
            inline
            options={stateOptions}
            value={toWeek}
            id="toWeek"
            onChange={handleChange}
          />
        </Form.Field>

        <Form.Field inline>
          <label>Username on previous course (github or university)</label>
          <Input
            type="text"
            value={fromUsername}
            id="fromUsername"
            onChange={handleChange}
          />
        </Form.Field>

        <Button
          disabled={!formValid()}
        >
          submit
        </Button>
      </Form>
    </div>
  )
}

export default Crediting
