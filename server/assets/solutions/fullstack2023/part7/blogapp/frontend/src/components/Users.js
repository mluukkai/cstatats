import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Users = () => {
  const users = useSelector(({ users }) => users)
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