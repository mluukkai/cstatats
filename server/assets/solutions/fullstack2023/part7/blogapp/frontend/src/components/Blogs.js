import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Blogs = () => {
  const byLikes = (b1, b2) => b2.likes - b1.likes
  const blogs = useSelector(({ blogs }) => [...blogs].sort(byLikes))

  const style = {
    marginBottom: 2,
    padding: 5,
    borderStyle: 'solid',
  }

  return(
    <div>
      {blogs.map((blog) => (
        <div key={blog.id} style={style}>
          <Link to={`blogs/${blog.id}`}>{blog.title}</Link>
        </div>
      ))}
    </div>
  )
}

export default Blogs