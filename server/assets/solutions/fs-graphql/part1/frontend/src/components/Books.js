import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS} from '../queries'  

const Books = (props) => {
  const allBookQuery = useQuery(ALL_BOOKS, {
    variables: { genre: null }
  })
  const [genre, setGenre] = useState(null)

  const genreBookQuery = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
    //pollInterval: 2000
  })

  if (!props.show || allBookQuery.loading || genreBookQuery.loading) {
    return null
  }

  const allBooks = allBookQuery.data.allBooks

  const genres = [...new Set(allBooks.reduce((s, b) => s.concat(b.genres), []))]

  const books = genre ? genreBookQuery.data.allBooks : allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(g => 
          <button onClick={() => setGenre(g)} key={g}>
            {g===genre ? <strong>{g}</strong> : g}
          </button>
        )}
        <button onClick={() => setGenre(null)}>{!genre ? <strong>all</strong> : 'all'}</button>
      </div>
    </div>
  )
}

export default Books
