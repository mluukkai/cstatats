import blogService from '../services/blogs'

import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    set(state, { payload }) {
      return payload
    },
    add(state, { payload }) {
      return state.concat(payload)
    },
    remove(state, { payload }) {
      return state.filter(s => s.id !== payload)
    },
    alter(state, { payload }) {
      return state.map(s => s.id !== payload.id ? s : payload)
    },
  },
})

const { set, add, remove, alter } = slice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const data = await blogService.getAll()
    dispatch(set(data))
  }
}

export const addBlog = (object) => {
  return async dispatch => {
    const data = await blogService.create(object)
    dispatch(add(data))
  }
}

export const updateBlog = (object) => {
  return async dispatch => {
    const data = await blogService.update(object)
    dispatch(alter(data))
  }
}

export const commentBlog = (id, comment) => {
  return async dispatch => {
    const data = await blogService.comment(id, comment)
    dispatch(alter(data))
  }
}

export const removeBlog = (object) => {
  return async dispatch => {
    await blogService.remove(object.id)
    dispatch(remove(object.id))
  }
}

export default slice.reducer