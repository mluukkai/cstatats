const Anecdote = ({ anecdote }) => {

  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>

      has {anecdote.votes} votes
    </div>
  )
}

export default Anecdote