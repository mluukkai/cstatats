const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

router.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if ( !blog.likes ) {
    blog.likes = 0
  }

  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user

  if ( !blog.title || !blog.url ) {
    return response.status(400).send({ error: 'title and url are required' })
  }

  blog.user = user
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

router.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if ( user.id.toString() !== blog.user.toString() ) {
    return response.status(401).send({ error: 'you can only delete your own blogs' })
  }

  await blog.delete()
  user.blogs = user.blogs.filter(b => b.id !== blog.id)
  await user.save()

  response.status(204).end()
})


router.put('/:id', async (request, response, next) => {
  const blog = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  response.json(updatedBlog.toJSON())
})

module.exports = router