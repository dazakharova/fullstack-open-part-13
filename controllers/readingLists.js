const router = require('express').Router()

const { Blog, User, ReadingList} = require('../models')

router.post('/', async (req, res, next) => {
  const { blogId, userId } = req.body

  try {
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(400).json({ error: 'invalid userId' })
    }

    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      return res.status(400).json({ error: 'invalid blogId' })
    }

    const readingList = await ReadingList.create({ blogId, userId })
    return res.status(201).json(readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router