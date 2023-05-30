import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from '../queries'

import { updateCacheWith } from '../util'

const NewBook = ({ show, setPage, setError }) => {
  const [title, setTitle] = useState('Testing 1')
  const [author, setAuthor] = useState('Tester Tester')
  const [published, setPublished] = useState('1991')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState(['test'])

  const [ createBook ] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: ALL_AUTHORS },
      { query: ALL_BOOKS, variables: { genre: null } } 
    ],
    onError: (error) => {
      console.log(error)
      setError(error.graphQLErrors[0].extensions.error.message)
    },
    onCompleted: () => {
      setPage('books')
    },
    update: (cache, response) => {
      const addedBook = response.data.addBook
      updateCacheWith(addedBook, cache)
    },
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({ variables: {
      title, author, genres,
      published: Number(published)  
    } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')

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