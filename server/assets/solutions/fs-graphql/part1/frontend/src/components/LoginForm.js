import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { STORAGE_KEY } from '../util'

const LoginForm = ({ setError, setToken, setPage, show }) => {
  const [username, setUsername] = useState('mluukkai')
  const [password, setPassword] = useState('secre')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.message)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      setPage('books')
      localStorage.setItem(STORAGE_KEY, token)
    }
  }, [result.data]) // eslint-disable-line

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
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

export default LoginForm