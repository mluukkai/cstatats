import React, { useState  } from 'react'
import { useDispatch  } from 'react-redux'
import { login } from '../reducers/user'
import { Button, TextField } from '@material-ui/core'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(login({
      username, password
    }))

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          helperText='username'
          id='username'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          helperText='password'
          id='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div style={{ marginTop: 15 }}>
        <Button variant='contained' color='primary' id='login' type='submit'>
          login
        </Button>
      </div>
    </form>
  )
}

export default Login