import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { IconButton, Button, TextField } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import { green } from '@material-ui/core/colors'

import { setNotification } from '../reducers/notification'
import { deleteBlog, likeBlog, commentBlog } from '../reducers/blogs'

const Comments = ({ comments }) => {
  if (comments.length === 0) {
    return <div>none so far...</div>
  }

  return (
    <div>
      <ul>
        {comments.map((comment, i) =>
          <li key={i} >
            {comment}
          </li>
        )}
      </ul>
    </div>
  )
}

const Blog = () => {
  const id = useParams().id
  const blog = useSelector(state => state.blogs.find(u => u.id === id))
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const history = useHistory()

  if (!blog) {
    return null
  }

  const own = user && user.username === blog.user.username

  const handleLike = async () => {
    dispatch(likeBlog(blog))
    dispatch(setNotification(`'${blog.title}' by ${blog.author} liked!`))
  }

  const handleRemove = async () => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)

    if (ok) {
      dispatch(deleteBlog(id))
      dispatch(setNotification(`${blog.title} by ${blog.author} removed`))
      history.push('/')
    }
  }

  const handleNewComment = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    event.target.comment.value = ''
    dispatch(commentBlog(blog.id, comment))
    dispatch(setNotification(`${blog.title} by ${blog.author} commented!`))
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>

      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <IconButton size="small" style={{ color: green[500] }} onClick={() => handleLike()} >
          <ThumbUpIcon />
        </IconButton>
      </div>
      <div>Added by {blog.user.name}</div>

      {own&&
        <IconButton size="small" onClick={() => handleRemove()} >
          <DeleteIcon />
        </IconButton>
      }

      <h3>comments</h3>

      <form onSubmit={handleNewComment}>
        <TextField variant='outlined' size='small' name='comment' style={{ marginRight: 5 }} />
        <Button type='submit' variant="contained" color="primary">
          add comment
        </Button>
      </form>

      <Comments comments={blog.comments}/>
    </div>
  )
}

export default Blog
