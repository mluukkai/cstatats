import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const User = () => {
  const id = useParams().id
  const user = useSelector(({ users }) => users.find(u => u.id === id) )

  if (!user) {
    return null
  }

  return (
    <div>
      <h3>{user.name}</h3>

      <h4>added blogs</h4>

      <ul>
        {user.blogs.map(b =>
          <li key={b.id}>
            {b.title}
          </li>
        )}
      </ul>
    </div>
  )
}

export default User