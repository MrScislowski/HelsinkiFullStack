const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
  const {username, password} = request.body

  const user = await User.findOne({username})
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    return response.status(401).json({error: 'invalid username or password'})
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({token, username: user.username, name: user.name, id:user._id})
})

module.exports = loginRouter