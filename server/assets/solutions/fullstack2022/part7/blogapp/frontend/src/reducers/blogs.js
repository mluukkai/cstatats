import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notification'

const byLikes = (b1, b2) => (b2.likes > b1.likes ? 1 : -1)

const slice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    initializeWith(state, { payload }) {
      return payload.sort(byLikes)
    },
    addNew(state, { payload }) {
      return state.concat(payload).sort(byLikes)
    },
    removeOne(state, { payload }) {
      return state.filter((b) => b.id !== payload).sort(byLikes)
    },
    update(state, { payload }) {
      return state.map((b) => (b.id === payload.id ? payload : b)).sort(byLikes)
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    blogService.getAll().then((response) => {
      dispatch(initializeWith(response))
    })
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    blogService.remove(id).then(() => {
      dispatch(removeOne(id))
    })
  }
}

export const reactToBlog = (blog, what) => {
  return async (dispatch) => {
    blogService.update(blog.id, blog).then((updatedBlog) => {
      dispatch(update(updatedBlog))
      dispatch(
        setNotification({
          message: `you ${what} '${blog.title}' by ${blog.author}`,
          type: 'info',
        })
      )
    })
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    blogService
      .create(blog)
      .then((response) => {
        dispatch(addNew(response))
        dispatch(
          setNotification({
            message: `a new blog '${blog.title}' by ${blog.author} added`,
            type: 'info',
          })
        )
      })
      .catch((error) => {
        dispatch(
          setNotification({
            message: 'creating a blog failed: ' + error.response.data.error,
            type: 'alert',
          })
        )
      })
  }
}

const { initializeWith, addNew, removeOne, update } = slice.actions
export default slice.reducer
