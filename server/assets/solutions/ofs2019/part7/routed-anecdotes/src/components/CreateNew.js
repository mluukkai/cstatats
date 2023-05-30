import  { useField } from '../hooks'

const CreateNew = ({ addNew }) => {
  const author = useField('text')
  const content = useField('text')
  const info = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: content.fields.value,
      author: author.fields.value,
      info: info.fields.value,
      votes: 0
    })
  }

  const onReset = () => {
    info.reset()
    author.reset()
    content.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.fields} />
        </div>
        <div>
          author
          <input {...author.fields} />
        </div>
        <div>
          url for more info
          <input {...info.fields} />
        </div>
        <button type='submit'>create</button>
        <button onClick={onReset} type='button'>reset</button>
      </form>
      
    </div>
  )
}

export default CreateNew