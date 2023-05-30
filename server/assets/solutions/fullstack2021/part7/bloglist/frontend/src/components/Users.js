import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Grid
} from '@material-ui/core'

const Users = () => {
  const users = useSelector(state => state.users)

  return <div>
    <h2>Users</h2>

    <Grid container spacing={3}>
      <Grid item xs={6}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <th>name</th>
                <th>blogs created</th>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user =>
                <TableRow key={user.id}>
                  <TableCell>
                    <Link to={`/users/${user.id}`}>
                      {user.username}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {user.blogs.length}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  </div>
}

export default Users