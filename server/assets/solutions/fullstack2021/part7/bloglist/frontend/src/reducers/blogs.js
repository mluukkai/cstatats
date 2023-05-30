import blogService from '../services/blogs'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'INIT_BLOGS':
    return action.data
  case 'DELETE_BLOG':
    return state.filter(b => b.id !== action.id)
  case 'UPDATE_BLOG':
    return state.map(b => b.id !== action.id ? b : action.data)
  default:
    return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const data = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data
    })
  }
}

export const newBlog = (blog) => {
  return async dispatch => {
    const data = await blogService.create(blog)
    dispatch({
      type: 'NEW_BLOG',
      data
    })
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    const liked = { ...blog, likes: blog.likes + 1 }
    const data = await blogService.update(liked)
    dispatch({
      type: 'UPDATE_BLOG',
      data,
      id: blog.id
    })
  }
}

export const commentBlog = (id, comment) => {
  return async dispatch => {
    const data = await blogService.comment(id, { comment })
    dispatch({
      type: 'UPDATE_BLOG',
      data,
      id
    })
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE_BLOG',
      id
    })
  }
}

export default reducer