const loginRouter = require('express').Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const User = require('../models/User')

loginRouter.post('/', async (request, response) => {

  if (!('username' in request.body) || !('password' in request.body)) {
    return response.status(400).json({ 'error': 'username and password required' })
  }

  const chosenUser = await User.findOne({ username: request.body.username })
  const passwordCorrect = chosenUser
    ? await bcrypt.compare(request.body.password, chosenUser.passwordHash)
    : false

  if (!passwordCorrect) {
    return response.status(401).json({ 'error': 'invalid username/password' })
  }

  const userForToken = {
    id: chosenUser._id,
    username: chosenUser.username,
  }

  const token = jwt.sign(userForToken, config.SECRET)

  response.status(200).json({ token, username: chosenUser.username, name: chosenUser.name })
})

module.exports = loginRouter