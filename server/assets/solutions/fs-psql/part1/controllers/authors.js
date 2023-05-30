const router = require('express').Router()
const { Op, fn, col, literal } = require('sequelize')

const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author', 
      [fn('COUNT', col('author')), 'blogs'],
      [fn('SUM', col('likes')), 'likes']
    ],
    group: ['author'],
    order: literal('SUM(likes) DESC')
  })


  res.send(authors)
})


module.exports = router