import React, { useState } from 'react'
import Select from 'react-select'
import { useMutation } from '@apollo/client'

import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const Authors = ({ show, authors }) => {
  const [nameSelection, setNameSelection] = useState(null)
  const [year, setYear] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  if (!show || !authors) {
    return null
  }

  const nameOptions = authors.map(author => ({ value: author.name, label: author.name }))

  const handleAuthorUpdate = (event) => {
    event.preventDefault()
    console.log(nameSelection.value, year)

    editAuthor({
      variables: { name: nameSelection.value, setBornTo: Number(year) }
    })
    setYear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>set birth year</h3>
      
      <form onSubmit={handleAuthorUpdate} >
        <Select
          value={nameSelection}
          onChange={selection => setNameSelection(selection)}
          options={nameOptions}
        />
        <div>
          born 
          <input 
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type='submit'>
          update author
        </button>
      </form>

    </div>
  )
}

export default Authors