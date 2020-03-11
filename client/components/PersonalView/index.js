import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment, Button, Form, Input } from 'semantic-ui-react'

import { getUserAction, updateUserAction } from 'Utilities/redux/userReducer'
import { clearNotification } from 'Utilities/redux/notificationReducer'

const PersonalView = () => {
  const { user } = useSelector(({ user }) => ({ user }))
  const dispatch = useDispatch()
  const [newName, setNewName] = useState('')
  const [newStudentNumber, setNewStudentNumber] = useState('')

  const initializeFields = () => {
    setNewName(newName || (user.name || '').trim())
    setNewStudentNumber(newStudentNumber || user.student_number)
  }

  const getUser = () => dispatch(getUserAction())
  const updateUser = async (fields) => {
    await dispatch(updateUserAction(fields))
    setTimeout(() => dispatch(clearNotification()), 8000)
    getUser()
  }
  useEffect(initializeFields, [user.name, user.student_number])

  useEffect(() => { getUser() }, [])

  const handleNameChange = ({ target }) => setNewName(target.value)
  const handleStudentNumberChange = ({ target }) => setNewStudentNumber(target.value)
  const handleSubmit = () => {
    updateUser({
      studentNumber: newStudentNumber || user.student_number,
      name: newName || user.name,
    })
  }

  const noName = !user.name || !user.name.trim()
  const noStudentNumber = !user.student_number
  return (
    <>
      <h4>Your information</h4>
      <div style={{ paddingBottom: 3 }}>
        <p>
          {`Name: ${user.name || ''}`}
        </p>
        <p>
          {`Student Number: ${user.student_number || ''}`}
        </p>
      </div>
      <div>
        <p>
          {noStudentNumber || noName ? 'If you want to to get credits you need a name and a student number from University of Helsinki' : null}
        </p>
        <p>
          {noName ? 'You need to have a name to get a course certificate.' : null}
        </p>
      </div>
      <Segment>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <Input
              label="Name"
              value={newName}
              name="name"
              onChange={handleNameChange}
            />
          </Form.Field>
          <Form.Field>
            <Input
              label="Student Number"
              value={newStudentNumber}
              name="studentNumber"
              onChange={handleStudentNumberChange}
            />
          </Form.Field>
          <Button primary>Save</Button>
        </Form>
      </Segment>
    </>
  )
}

export default PersonalView
