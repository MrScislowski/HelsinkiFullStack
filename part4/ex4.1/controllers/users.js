const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  response.json(await User.find({}))
})

usersRouter.post('/', async (request, response) => {
  const {username, name, password} = request.body

  console.log('search for username returned:', await User.findOne({username}))

  if (await User.findOne({username})) {
    return response.status(400).json({error: 'username already taken'})
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = new User({username, name, passwordHash})

  const retVal = await newUser.save()
  return response.json(retVal)
})

module.exports = usersRouter