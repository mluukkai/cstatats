import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@material-ui/core'

const Bloglist = () => {
  const blogs = useSelector(state => state.blogs)
  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      <h2>Blogs</h2>
      <TableContainer component={Paper} style={{ marginTop: 10 } }>
        <Table>
          <TableBody>
            {blogs.sort(byLikes).map(blog =>
              <TableRow  key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {blog.author}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Bloglist