const router = require('express').Router()

const { Blog, User } = require('../models')
const {Op} = require("sequelize");
const {tokenExtractor} = require("../util/middleware");

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = { [Op.or]: [
        {
          title: { [Op.iLike]: `%${req.query.search}%`, }
        },
        {
          author: { [Op.iLike]: `%${req.query.search}%`,
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'username'],
    },
    where,
    order: [
        ['likes', 'DESC'],
    ]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
    return res.json(blog)
  } catch(error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    if (blog.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'only the creator can delete this blog' })
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