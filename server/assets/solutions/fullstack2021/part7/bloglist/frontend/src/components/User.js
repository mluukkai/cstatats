import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const User = () => {
  const id = useParams().id
  const user = useSelector(state => state.users.find(u => u.id === id))

  return <div>
    <h2>{user.name || user.username}</h2>

    <h3>added blogs</h3>

    <ul>
      {user.blogs.map(b => <li key={b.key}>
        {b.title}
      </li>)}
    </ul>

  </div>
}

export default User