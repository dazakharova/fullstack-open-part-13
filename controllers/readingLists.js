const router = require('express').Router()

const { Blog, User, ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

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

router.put('/:id', tokenExtractor, async (req, res, next) => {
  const { id } = req.params
  const { read } = req.body

  try {
    const readingList = await ReadingList.findByPk(id)

    if (!readingList) {
      return res.status(404).json({ error: 'reading list not found' })
    }

    if (readingList.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'not allowed to update this reading list' })
    }

    readingList.read = read
    await readingList.save()

    return res.status(200).json(readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router