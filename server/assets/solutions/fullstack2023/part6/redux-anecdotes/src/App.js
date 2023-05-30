import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'

import anecdotes from './services/anecdoteService'
import { initializeAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    anecdotes.getAll().then(anecdotes => {
     dispatch(initializeAnecdotes(anecdotes))
    })
  }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App