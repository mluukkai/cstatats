import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { likeAnecdote, initializeAnecdotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  
  const anecdotes = useSelector(state => state.filter ? 
    state.anecdotes.filter(a => a.content.includes(state.filter)): 
    state.anecdotes
  )
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch]) 

  const vote = (id) => {
    const theAnecdote = anecdotes.find(a => a.id === id)
    dispatch(likeAnecdote(theAnecdote))
    const message = `anecdote ${anecdotes.find(a => a.id === id).content} liked`
    dispatch(setNotification(message, 5))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList