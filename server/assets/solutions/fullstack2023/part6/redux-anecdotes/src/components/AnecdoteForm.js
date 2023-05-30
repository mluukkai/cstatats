import { useDispatch } from 'react-redux'

import { createAnecdote } from '../reducers/anecdoteReducer' 
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    dispatch(createAnecdote({ content, votes: 0 }))
    dispatch(setNotification(`anecdote ${content} voted`, 5))
}

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm