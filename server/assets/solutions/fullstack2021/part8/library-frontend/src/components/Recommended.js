
import React from 'react'
import { useQuery } from '@apollo/client'

import { ME } from '../queries'

const Recommended = ({ show, books }) => {
  const me = useQuery(ME)
  if (!show || !books) {
    return null
  }

  const genre = me.data ? me.data.me.favoriteGenre : null

  const booksToShow = books.filter(b => b.genres.includes(genre))

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre <strong>{genre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksToShow.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended