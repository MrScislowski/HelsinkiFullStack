const errorHandler = (error, req, res, next) => {

  console.log(`Error handler called with error: ${JSON.stringify(error, null, 2)}`)

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

module.exports = { errorHandler }