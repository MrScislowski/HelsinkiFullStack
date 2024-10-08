const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const errorHandler = (error, req, res, next) => {

  logger.error(`Error handler called with error: ${JSON.stringify(error, null, 2)}`)

  if (error.code === 11000) {
    res.status(400).send({ error: 'username must be unique' })
  } else if (error.name === 'CastError') {
    res.status(400).send({ error: 'invalid ID format' })
  } else if (error.name === 'ValidationError') {
    res.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    res.status(400).send({ error: 'invalid token' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  let authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    authorization = authorization.replace('Bearer ', '')
  }

  request.token = authorization
  next()
}

const userExtractor = (request, response, next) => {
  request.user = jwt.decode(request.token)
  next()
}

module.exports = { errorHandler, tokenExtractor, userExtractor }