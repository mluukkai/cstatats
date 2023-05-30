import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { notify } from '../reducers/notification'
import { initializeBlogs } from '../reducers/blogs'
import { initializeUsers } from '../reducers/users'
import { initUser, clearUser } from '../reducers/user'

export const useNotification = () => {
  const dispatch = useDispatch()

  return (message, type = 'info')  => {
    dispatch(notify(message, type))
  }
}

export const useInitialization = () => {
  const dispatch = useDispatch()

  return ()  => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
    dispatch(initUser())
  }
}

export const useClearUser = () => {
  const dispatch = useDispatch()

  return ()  => {
    dispatch(clearUser())
  }
}

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}