const router = require('express').Router()

const { User, Blog, Readinglist } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ['title', 'url', 'author', 'likes']
    }
  })

  res.json(users)
})

router.get('/:id', async (req, res) => {
  const where = {
    user_id: req.params.id
  }

  if ( req.query.read ) {
    where.read = req.query.read === 'false' ? false : true
  }

  const user = await User.findByPk(req.params.id,{
    include: { 
      model: Blog, 
      as: 'readings',
      attributes: { exclude: ['userId']},
      through: {
        attributes: []
      },
      include: {
        model: Readinglist,
        where,
        attributes: [ 'read', 'id' ]
      },
    },
  })
  res.json(user)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    username: req.params.username
  })

  user.name = req.body.name
  await user.save()

  res.json(user)
})

module.exports = router