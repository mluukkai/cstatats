import { useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../requests'

import { useNotify } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notifyWith = useNotify()

  const anecdoteMutation = useMutation(createAnecdote, {
    onSuccess: ({ content }) => {
      queryClient.invalidateQueries('anecdotes')
      notifyWith(`anecdote '${content}' created`)
    },
    onError: (error) => {
      notifyWith(error.response.data.error)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    anecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm