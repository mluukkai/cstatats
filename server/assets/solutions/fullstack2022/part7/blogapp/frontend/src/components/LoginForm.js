import { useDispatch } from 'react-redux'
import loginService from '../services/login'
import userService from '../services/user'
import { loginUser } from '../reducers/user'
import { useField } from '../hooks'

import { setNotification } from '../reducers/notification'

import { Button, Input } from '.'

const LoginForm = () => {
  const username = useField('text')
  const password = useField('password')

  const dispatch = useDispatch()

  const notify = (message, type = 'info') => {
    dispatch(setNotification({ message, type }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    loginService
      .login({
        username: username.fields.value,
        password: password.fields.value,
      })
      .then((user) => {
        userService.setUser(user)

        dispatch(loginUser(user))
        notify(`${user.name} logged in!`)
      })
      .catch(() => {
        notify('wrong username/password', 'alert')
      })
  }

  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <Input {...username.fields} />
        </div>
        <div>
          password
          <Input {...password.fields} />
        </div>
        <Button id="login-button" type="submit">
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
