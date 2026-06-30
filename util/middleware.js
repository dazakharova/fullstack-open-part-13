const {verify} = require("jsonwebtoken");
const {SECRET} = require("./config");

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    if (error.message.includes('Validation isEmail on username failed')) {
      return res.status(400).json({ error: 'username must be a valid email address' })
    }

    if (error.message.includes('Validation min on year failed')) {
      return res.status(400).json({ error: 'year must be at least 1991' })
    }

    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: error.message })
  }

  return res.status(500).json({ error: 'internal server error' })
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor
}