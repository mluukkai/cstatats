import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import usersService from '../services/users'

const User = () => {
  const id = useParams().id
  const result = useQuery(['users', id], () => usersService.getOne(id))


  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const user = result.data

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