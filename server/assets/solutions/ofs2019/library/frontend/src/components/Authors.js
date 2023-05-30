import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import Select from 'react-select'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [year, setYear] = useState('')
  const [selected, setSelected] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  const options = authors.map((a) => ({ value: a.name, label: a.name }))

  const handleAuthorUpdate = async (event) => {
    event.preventDefault()
    editAuthor({
      variables: {
        name: selected.value,
        setBornTo: Number(year),
      },
      refetchQueries: [{ query: ALL_AUTHORS }],
    })

    setYear('')
    setSelected('')
  }

  const handleChange = (selectedOption) => {
    setSelected(selectedOption)
  }

  return (
    <div>
      <h2>authors</h2>
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

      <h2>set birthyear</h2>
      <form onSubmit={handleAuthorUpdate}>
        <Select value={selected} onChange={handleChange} options={options} />
        <input value={year} onChange={({ target }) => setYear(target.value)} />
        <button>update author</button>
      </form>
    </div>
  )
}

export default Authors
