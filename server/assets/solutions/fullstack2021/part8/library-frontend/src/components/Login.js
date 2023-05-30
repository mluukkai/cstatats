import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { LOGIN } from '../queries'

const Login = ({ show, setToken, setNotification, changePage }) => {
  const [username, setUsername] = useState('mluukkai')
  const [password, setPassword] = useState('secret')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setNotification({ message: error.graphQLErrors[0].message, color: 'red' } )
      setTimeout(() => {
        setNotification(null)
      }, 4000)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    changePage()
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default Login