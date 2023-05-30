import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'  

import Select from 'react-select'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [born, setBorn] = useState(2000)

  const [ editAurhor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [
      { query: ALL_AUTHORS }
    ]
  })

  if (!props.show || result.loading) {
    return null
  }

  const handleEditAuthor = (event) => {
    event.preventDefault()
    const name = event.target.nameSelect.value
    editAurhor({
      variables: { name, born: Number(born) }
    })
  } 

  const authors = result.data.allAuthors

  const authorOptions = authors.map(a => ({ value: a.name, label: a.name }))

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>

      <form onSubmit={handleEditAuthor}>
        <input
          value={born} type='number'
          onChange={({ target }) => setBorn(target.value)}
        />
        <Select
          options={authorOptions}
          name='nameSelect'
        />
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
