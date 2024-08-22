const testingRouter = require('express').Router()

const User = require('../models/User')
const Blog = require('../models/Blog')

testingRouter.post('/reset', async (request, response) => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  response.status(200).send()
})

module.exports = testingRouter