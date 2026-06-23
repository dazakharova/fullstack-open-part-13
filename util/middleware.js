const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    if (error.message.includes('Validation isEmail on username failed')) {
      return res.status(400).json({ error: 'username must be a valid email address' })
    }

    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: error.message })
  }

  return res.status(500).json({ error: 'internal server error' })
}

module.exports = {
  errorHandler
}