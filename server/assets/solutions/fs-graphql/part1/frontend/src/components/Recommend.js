import { useQuery } from '@apollo/client'

import { ALL_BOOKS, ME } from '../queries'  

const Recommend = ({ show }) => {
  const meQuery = useQuery(ME)

  const genre = meQuery.data ? meQuery.data.me.favoriteGenre : null

  const bookQuery = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre
  })

  if (!show || meQuery.loading || bookQuery.loading) {
    return null
  }

  const books = bookQuery.data.allBooks

  return (
    <div>
      <h3>books in my favourite genre <i>{genre}</i></h3>

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
    </div>
  )
}

export default Recommend
