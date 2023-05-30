import { useState } from 'react'

const Anecdote = ({ text, vote_count }) =>
  <>
    {text} 
    <div>
      has {vote_count} votes
    </div>
  </>


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0, 0])

  let most_voted = 0
  for (let i = 0; i<anecdotes.length; i++) {
    if (votes[i] > votes[most_voted]) {
      most_voted = i
    }
  }

  const next = () => {
    let newSelected = selected
    while (newSelected === selected) {
      newSelected = Math.floor(Math.random()*anecdotes.length)
    }

    setSelected(newSelected)
  }

  const vote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  return (
    <div>
      <h3>Anecdote of the day</h3>
      <Anecdote 
        text ={anecdotes[selected]}
        vote_count={votes[selected]}
      />
      <div>
        <button onClick={vote}>vote</button> <button onClick={next}>next anecdote</button>
      </div>
      <h3>Anecdote with most votes</h3>
      <Anecdote 
        text ={anecdotes[most_voted]}
        vote_count={votes[most_voted]}
      />
    </div>
  )
}

export default App