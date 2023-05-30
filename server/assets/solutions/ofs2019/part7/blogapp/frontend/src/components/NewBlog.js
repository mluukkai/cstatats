import { useDispatch } from 'react-redux'
import { addBlog } from '../reducers/blogs'
import { useNotification, useField } from '../hooks/index'
import { SmallButton, Input, GridTwoColumns } from './styled'

const BlogForm = ({ hideMe }) => {
  const title = useField('text')
  const author = useField('text')
  const url= useField('text')

  const dispatch = useDispatch()
  const notifyWith = useNotification()

  const handleSubmit = async (event) => {
    event.preventDefault()

    notifyWith(`A new blog '${title.value}' by '${author}' added`)
    dispatch(addBlog({
      title: title.value,
      author: author.value,
      url: url.value
    }))
    hideMe()
  }

  return (
    <div>
      <h4>Create a new blog</h4>

      <form onSubmit={handleSubmit}>
        <GridTwoColumns>
          <div>title</div>
          <div>
            <Input
              id="title"
              placeholder="title"
              {...title}
            />
          </div>
          <div>author</div>
          <div>
            <Input
              id="author"
              placeholder="author"
              {...author}
            />
          </div>
          <div>input</div>
          <div>
            <Input
              id="url"
              placeholder="url"
              {...url}
            />
          </div>
        </GridTwoColumns>

        <SmallButton style={{ marginBottom: 10 }} type="submit">create</SmallButton>
      </form>
    </div>
  )
}

export default BlogForm
