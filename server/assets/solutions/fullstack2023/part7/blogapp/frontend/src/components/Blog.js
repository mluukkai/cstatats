import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'

import { removeBlog, updateBlog, commentBlog } from '../reducers/blogs'
import { useNotification } from '../hooks/index'

import { SmallButton } from './styled'

const Blog = () => {
  const [comment, setComment] = useState('')
  const id = useParams().id
  const blog = useSelector(({ blogs }) => blogs.find(u => u.id === id) )
  const user = useSelector(({ user }) => user)

  const dispatch = useDispatch()
  const notifyWith = useNotification()
  const navigate = useNavigate()

  if (!blog || !user) {
    return null
  }

  const canRemove = blog.user.username === user.username

  const remove = () => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`
    )
    if (ok) {
      dispatch(removeBlog(blog))
      notifyWith(`The blog' ${blog.title}' by '${blog.author} comment`)
      navigate('/')
    }
  }

  const like = () => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    dispatch(updateBlog(blogToUpdate))
    notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`)
  }

  const addComment = () => {
    dispatch(commentBlog(blog.id, comment))
    notifyWith('Comment added!')
    setComment('')
  }

  const margined = { marginBottom: 5 }

  return (
    <div className="blog">
      <div style={ margined }>
        <strong>{blog.title} </strong> by <strong>{blog.author}</strong>
      </div>

      <div style={ margined }>
        <a href={blog.url}> {blog.url}</a>{' '}
      </div>

      <div style={ margined }>
        likes {blog.likes} <SmallButton onClick={like}>like</SmallButton>
      </div>

      <div style={ margined }>
        added by {blog.user && blog.user.name}
      </div>
      {canRemove && <SmallButton onClick={remove}>delete</SmallButton>}

      <h3>comments:</h3>

      <input value={comment} onChange={({ target }) => setComment(target.value)} />
      <SmallButton onClick={addComment}>add comment</SmallButton>

      <ul>
        {blog.comments.map((c, i) => <li key={i}>{c}</li>)}
      </ul>

    </div>
  )
}

export default Blog
