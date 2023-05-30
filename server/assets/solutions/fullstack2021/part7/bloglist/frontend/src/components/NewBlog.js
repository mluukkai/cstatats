import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, TextField } from '@material-ui/core'

import { setNotification } from '../reducers/notification'
import { newBlog } from '../reducers/blogs'

const NewBlog = ({ hideComponent }) => {
  const [title, setTitle] = useState('a')
  const [author, setAuthor] = useState('a')
  const [url, setUrl] = useState('a')
  const dispatch = useDispatch()

  const handleNewBlog = (event) => {
    event.preventDefault()

    hideComponent()

    dispatch(newBlog({
      title, author, url
    }))

    dispatch(setNotification(`a new blog '${title}' by ${author} added!`))

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          <TextField
            id='author'
            helperText='author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            id='title'
            helperText='title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            id='url'
            helperText='url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button variant='contained' color='primary' id="create">create</Button>
      </form>
    </div>
  )
}

export default NewBlog