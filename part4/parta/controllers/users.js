const bcrypt = require('bcrypt')
const app = require('../app')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const allUsers = await User.find({}).populate('notes', {content: 1, date: 1})
  response.status(200).json(allUsers)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  
  if (await User.findOne({username: username})) {
    return response.status(400).json(
      {error: 'username must be unique'}
    )
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter