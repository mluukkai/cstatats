import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, GENRES } from '../queries'
import BookList from './BookList'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const resultGenres = useQuery(GENRES)
  const options = () => {
    if (!genre) return undefined
    return {
      variables: {
        genre,
      },
    }
  }

  const resultSelection = useQuery(ALL_BOOKS, options())

  const genres = resultGenres.data ? resultGenres.data.allGenres : []

  if (!props.show) {
    return null
  }

  if (resultGenres.loading || !resultSelection.data) {
    return <div>loading...</div>
  }

  const books = resultSelection.data.allBooks

  const inactive = { marginTop: 10 }
  const active = {
    marginTop: 10,
    fontWeight: 'bold',
    fontStyle: 'italic',
    backgroundColor: '#BEBEBE',
  }

  return (
    <div>
      <h2>books</h2>

      <BookList books={books} />

      <div style={{ marginTop: 10 }}>
        {genres.map((g) => (
          <button
            style={genre === g ? active : inactive}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
        <button
          style={!genre ? active : inactive}
          onClick={() => setGenre(null)}
        >
          all
        </button>
      </div>
    </div>
  )
}

export default Books
