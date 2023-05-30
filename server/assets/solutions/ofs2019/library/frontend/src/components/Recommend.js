import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import BookList from './BookList'

const Recommended = (props) => {
  const [genre, setGenre] = useState(null)

  const resultMe = useQuery(ME)
  const resultBooks = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
  })

  useEffect(() => {
    if (!resultMe.loading) {
      setGenre(resultMe.data.me.favoriteGenre)
    }
  }, [resultMe.data, resultMe.loading])

  if (!props.show) {
    return null
  }

  if (resultMe.loading || !resultBooks.data) {
    return <div>loading...</div>
  }

  const books = resultBooks.data.allBooks

  return (
    <div>
      <h2>Recommendations</h2>

      <div style={{ marginBottom: 5 }}>
        books in your facvorite genre <strong>{genre}</strong>
      </div>

      <BookList books={books} />
    </div>
  )
}

export default Recommended
