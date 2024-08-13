const usersRouter = require('express').Router()

const bcrypt = require('bcrypt')

const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
  const allUsers = await User.find({})
  response.json(allUsers)
})

usersRouter.post('/', async (request, response) => {

  if (!('username' in request.body) || !('password' in request.body) || !('name' in request.body)) {
    return response.status(400).send()
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

  const user = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash,
  })

  await user.save()

  response.status(201).send()
})

module.exports = usersRouter