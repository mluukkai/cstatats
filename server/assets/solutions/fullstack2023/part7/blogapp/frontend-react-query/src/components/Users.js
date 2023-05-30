import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import usersService from '../services/users'

const Users = () => {
  const result = useQuery('users', usersService.getAll)

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const users = result.data

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u =>
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>
                {u.blogs.length}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}


export default Users