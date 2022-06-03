const blogsRouter = require('express').Router()
const res = require('express/lib/response')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  response.json(await Blog.find({}))
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog({
    likes: request.body.likes ? request.body.likes : 0,
    ...request.body
  })

  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter