const router = require('express').Router()

const { Readinglist } = require('../models')
const { userFromToken } = require('../util/middleware')

router.post('/', async (req, res) => {
  const reading = await Readinglist.create(req.body)
  res.json(reading)
})

router.put('/:id', userFromToken, async (req, res) => {
  const reading = await Readinglist.findByPk(req.params.id)
  if ( req.user.id !== reading.userId) {
    return res.status(401).send({
      error: 'only allowed to change status of own readings'
    })
  }

  reading.read = req.body.read
  await reading.save()
  res.json(reading)
})

module.exports = router