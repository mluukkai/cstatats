import {  useMutation, useQueryClient } from 'react-query'
import blogService from '../services/blogs'
import { useNotifier } from '../contexts/notification'
import { useField } from '../hooks'

import { SmallButton, Input, GridTwoColumns } from './styled'

const BlogForm = ({ hideMe }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const queryClient = useQueryClient()
  const notifyWith = useNotifier()

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    newBlogMutation.mutate({
      title: title.value,
      author: author.value,
      url: url.value
    })
    notifyWith(`A new blog '${title.value}' by '${author.value}' added`)
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