import { useField } from '../hooks'
import { useLogin } from '../contexts/user'
import { useNotifier } from '../contexts/notification'
import { Button, Input } from './styled'

const LoginForm = () => {
  const username = useField('text')
  const password = useField('password')

  const doLogin = useLogin()
  const notifyWith = useNotifier()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await doLogin({
        username: username.value,
        password: password.value
      })
      notifyWith('welcome!')
    } catch(e) {
      notifyWith('wrong username or password', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <Input
          id='username'
          {... username}
        />
      </div>
      <div>
        password
        <Input
          id='password'
          type="password"
          {... password}
        />
      </div>
      <Button id='login-button' type="submit">
        login
      </Button>
    </form>
  )
}

export default LoginForm