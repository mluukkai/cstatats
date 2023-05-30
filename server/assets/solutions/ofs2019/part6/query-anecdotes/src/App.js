import { useQuery, useMutation, useQueryClient } from 'react-query'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotify } from './NotificationContext'

const App = () => {
  const result = useQuery(
    'anecdotes',
    getAnecdotes, {
      retry: 1
    }
  )

  const queryClient = useQueryClient()
  const notifyWith = useNotify()

  const voteMutation = useMutation(updateAnecdote, {
    onSuccess: ({ content }) => {
      queryClient.invalidateQueries('anecdotes')
      notifyWith(`anecdote '${content}' voted`)
    }
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  const handleVote = (anecdote) => {
    const votedAnecdote = {...anecdote, votes: anecdote.votes + 1 }
    voteMutation.mutate(votedAnecdote)
  }

  const anecdotes = result.data

  return (
    <div>
      <h2>Anecdote app</h2>
      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App