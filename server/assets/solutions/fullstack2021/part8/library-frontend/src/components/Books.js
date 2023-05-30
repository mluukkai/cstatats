import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = ({ show, genres }) => {
  const [genre, setGenre] = useState(null)
  const [books, setBooks] = useState([]) 

  const [ getBooksOfGenre, result ] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  useEffect(() => {
    getBooksOfGenre({ variables: { genre } }) 
  }, [genre]) // eslint-disable-line

  if (!show || !books) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

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
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {genres.map(g => 
          <button key={g} onClick={() => setGenre(g)}>
            {g === genre ? <strong>{g}</strong> : g} 
          </button>
        )}
        <button onClick={() => setGenre(null)}>
          {!genre ? <strong>all</strong> : 'all'} 
        </button>
      </div>
    </div>
  )
}

export default Books