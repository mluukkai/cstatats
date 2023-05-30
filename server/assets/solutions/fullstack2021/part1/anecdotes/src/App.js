import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [best, setBest] = useState(0)
  const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0])

  const change = () => {
    const n =  Math.floor(Math.random() * anecdotes.length)
  
    setSelected(n)
  }

  const vote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
  
    setVotes(newVotes)
    if ( newVotes[selected] > newVotes[best] ) {
      setBest(selected)
    }
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected]}</div>
      <p>has {votes[selected]} votes</p>
      <button onClick={change}>next anecdote</button>
      <button onClick={vote}>vote</button>

      <h2>Anechote with most votes</h2>
      <div>{anecdotes[best]}</div>
    </div>
  )
}

export default App