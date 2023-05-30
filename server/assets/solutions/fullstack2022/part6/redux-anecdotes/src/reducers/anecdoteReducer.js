import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdote(state, action) {
      const anecdote = action.payload

      return state.map(a => a.id === anecdote.id ? anecdote : a)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { setAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const likeAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.update(anecdote.id, anecdote)
    dispatch(setAnecdote(updatedAnecdote))
  }
}

export const createAnecdote = (newAnecdote) => {
  return async dispatch => {
    const createdAnecdote = await anecdoteService.createNew(newAnecdote)
    dispatch(appendAnecdote(createdAnecdote))
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export default anecdoteSlice.reducer
