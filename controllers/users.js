const router = require('express').Router()

const { User, Blog, ReadingList} = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
      }
    ]
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
      through: {
        attributes: ['id', 'read']
      }
    }
  })

  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  res.json(user)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body})
    return res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (!user) {
      return res.status(404).json({})
    }

    const { name } = req.body
    user.name = name
    await user.save()
    return res.status(200).json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = router
