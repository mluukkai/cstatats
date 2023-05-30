import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'LIKE':
      const updatedState = state.map(a => a.id !== action.id ? a : action.data)
      return updatedState.sort((a1, a2) => a2.votes - a1.votes)
    case 'CREATE':
      return state.concat(action.data)
    case 'INIT':
      return action.data
    default: 
      return state
  }
}

export const likeAnecdote = (anecdote) => {
  return async dispatch => {
    const data = await anecdoteService.update(anecdote.id, anecdote)
    dispatch({
      type: 'LIKE',
      data,
      id: anecdote.id
    })
  }
}

export const createAnecdote = (newAnecdote) => {
  return async dispatch => {
    const data = await anecdoteService.createNew(newAnecdote)
    dispatch({
      type: 'CREATE',
      data
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const data = await anecdoteService.getAll()
    dispatch({
      type: 'INIT',
      data
    })
  }
}

/*
export const initializeAnecdotes = (data) => {
  return {
    type: 'INIT',
    data
  }
}
*/

export default reducer