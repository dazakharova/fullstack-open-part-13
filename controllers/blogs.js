const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create({...req.body})
    return res.json(blog)
  } catch(error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    await blog.destroy()
    return res.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    const { likes } = req.body
    blog.likes = likes
    await blog.save()
    return res.status(200).json(blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router