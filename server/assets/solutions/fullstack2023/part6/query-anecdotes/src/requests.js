import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => {
  return axios.get(baseUrl).then(res => res.data)
}

export const createAnecdote = (object) => {
  return axios.post(baseUrl, object).then(res => res.data)
}

export const updateAnecdote = (object) => {
  return axios.put(`${baseUrl}/${object.id}`, object).then(res => res.data)
}