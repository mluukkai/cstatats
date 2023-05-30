const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { userFromToken } = require('../util/middleware')

router.get('/', async (req, res) => {
  let where = {
  }

  if (req.query.search) {
    where = {
      [Op.or]: {
        title: {
          [Op.iLike]: `%${req.query.search}%`
        },
        author: {
          [Op.iLike]: `%${req.query.search}%`
        },    
      }
    }
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name', 'username']
    },
    where,
    order: [['likes', 'DESC']]
  })

  res.json(blogs)
})

router.post('/', userFromToken, async (req, res) => {
  const blog = await Blog.create({ ...req.body, userId: req.user.id })
  res.json(blog)
})

router.delete('/:id', userFromToken, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  console.log(blog.userId, req.user.id )
  if (blog.userId !== req.user.id) {
    return res.status(401).send({
      error: 'only creator allowed to delete a blog'
    })
  }
  if (blog) {
    await blog.destroy()
  }
  res.status(204).end()
})

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    blog.likes =  req.body.likes
    await blog.save()
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router