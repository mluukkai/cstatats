import { useDispatch, useSelector } from 'react-redux'
import { removeBlog, reactToBlog } from '../reducers/blogs'
import { useParams, useNavigate } from 'react-router-dom'

import { useField } from '../hooks'

import { Button } from '.'

const Blog = () => {
  const { id } = useParams()
  const blog = useSelector((state) => state.blogs.find((u) => u.id === id))
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const comment = useField('text')

  const user = useSelector((state) => state.user)

  if (!blog) {
    return null
  }

  const own = user && blog.user && user.username === blog.user.username

  const addedBy = blog.user && blog.user.name ? blog.user.name : 'anonymous'

  const onRemoveBlog = () => {
    const ok = window.confirm(`remove '${blog.title}' by ${blog.author}?`)

    if (!ok) {
      return
    }

    dispatch(removeBlog(blog.id))
    navigate('/')
  }

  const onLike = async () => {
    const liked = {
      ...blog,
      likes: (blog.likes || 0) + 1,
      user: blog.user.id,
    }
    dispatch(reactToBlog(liked, 'liked'))
  }

  const onAddComment = () => {
    console.log(comment.fields.value)
    const commented = {
      ...blog,
      comments: blog.comments.concat(comment.fields.value),
      user: blog.user.id,
    }
    dispatch(reactToBlog(commented, 'commented'))
    comment.reset()
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes <Button onClick={onLike}>like</Button>
      </div>
      <div>added by {addedBy}</div>
      {own && <Button onClick={onRemoveBlog}>remove</Button>}

      <h3>comments</h3>

      <div>
        <input {...comment.fields} />{' '}
        <Button onClick={onAddComment}> add comment</Button>
      </div>

      <ul>
        {blog.comments.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
