import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment, Form, Message } from 'semantic-ui-react'
import { validateStudentNumber } from 'Utilities/common'
import { getUserAction, updateUserAction } from 'Utilities/redux/userReducer'
import { clearNotification } from 'Utilities/redux/notificationReducer'

const PersonalView = () => {
  const { user } = useSelector(({ user }) => ({ user }))
  const dispatch = useDispatch()
  const [newName, setNewName] = useState('')
  const [newStudentNumber, setNewStudentNumber] = useState('')
  const [nameValid, setNameValid] = useState(true)
  const [studentNumberValid, setStudentNumberValid] = useState(true)

  const initializeFields = () => {
    setNewName(newName || (user.name || '').trim())
    setNewStudentNumber(newStudentNumber || user.student_number || '')
  }

  const getUser = () => dispatch(getUserAction())
  const updateUser = async (fields) => {
    await dispatch(updateUserAction(fields))
    setTimeout(() => dispatch(clearNotification()), 8000)
    getUser()
  }
  useEffect(initializeFields, [user.name, user.student_number])

  const validateName = name => !!(name && name.trim())

  useEffect(() => {
    setNameValid(validateName(newName))
    setStudentNumberValid(!newStudentNumber || validateStudentNumber(newStudentNumber))
  }, [newName, newStudentNumber])

  useEffect(() => { getUser() }, [])

  const handleNameChange = ({ target }) => setNewName(target.value)
  const handleStudentNumberChange = ({ target }) => setNewStudentNumber(target.value)
  const handleSubmit = () => {
    const studentNumber = studentNumberValid ? newStudentNumber : user.student_number
    const name = nameValid ? newName : user.name
    if (!confirm(`Name ${name} and Student Number ${studentNumber || 'empty'}`)) return

    updateUser({
      studentNumber,
      name,
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
            <Form.Input
              error={!nameValid}
              label="Name"
              value={newName}
              name="name"
              onChange={handleNameChange}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              error={!studentNumberValid}
              label="Student Number"
              value={newStudentNumber}
              name="studentNumber"
              onChange={handleStudentNumberChange}
            />
          </Form.Field>
          <Message info>
            Student number refers to your University of Helsinki student number. If you have
            signed up for a course through Open University and do not have a
            University of Helsinki account, you can request a student number
            from
            {' '}
            <a href="mailto:avoin-student@helsinki.fi">
              avoin-student@helsinki.fi
            </a>
            . Rember to include your name and date of birth in the message.
          </Message>

          <Form.Button primary>Save</Form.Button>
        </Form>
      </Segment>
    </>
  )
}

export default PersonalView
