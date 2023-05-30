import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {

  const add = async (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
    props.createAnecdote(content)
    const message = `anecdote ${content} created`
    props.createNotification(message, 5)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={add} >
        <div><input name='content'/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default connect(null, { createAnecdote, createNotification })(AnecdoteForm)
