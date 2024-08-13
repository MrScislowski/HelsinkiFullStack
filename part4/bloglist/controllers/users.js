const usersRouter = require('express').Router()

const bcrypt = require('bcrypt')

const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
  const allUsers = await User.find({}).populate('blogs')
  response.json(allUsers)
})

usersRouter.post('/', async (request, response) => {

  if (!('username' in request.body) || !('password' in request.body) || !('name' in request.body)) {
    return response.status(400).send()
  }


  if (request.body.password.length < 3) {
    const error = new Error('password must be at least 3 characters long')
    error.name = 'ValidationError'
    throw error
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

  const user = new User({
    username: request.body.username,
    name: request.body.name,
    blogs: [],
    passwordHash,
  })

  await user.save()

  response.status(201).send()
})

module.exports = usersRouter