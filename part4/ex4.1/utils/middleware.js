const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = (request, response, next) => {
  const user = jwt.decode(request.token, process.env.SECRET)

  request.user = user

  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}