import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS, GENRES } from '../queries'

export const updateCacheWith = (cache, addBook) => {
  addBook.genres.forEach((genre) => {
    const query = cache.readQuery({
      query: ALL_BOOKS,
      variables: { genre },
    })

    if (query) {
      const uniqById = (a) => {
        let seen = new Set()
        return a.filter((item) => {
          let k = item.id
          return seen.has(k) ? false : seen.add(k)
        })
      }

      cache.updateQuery(
        { query: ALL_BOOKS, variables: { genre } },
        ({ allBooks }) => {
          return {
            allBooks: uniqById(allBooks.concat(addBook)),
          }
        }
      )
    }
  })
}

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK)

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      },
      refetchQueries: [
        { query: ALL_BOOKS },
        { query: ALL_AUTHORS },
        { query: GENRES },
      ],
      update: (cache, { data }) => {
        updateCacheWith(cache, data.addBook)
      },
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')

    props.setPage('books')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
