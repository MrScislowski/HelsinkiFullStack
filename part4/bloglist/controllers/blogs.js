const blogsRouter = require('express').Router()

const Blog = require('../models/Blog')

blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({})
  response.json(allBlogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog({
    likes: request.body.likes || 0,
    ...request.body
  })

  const saveResult = await blog.save()

  response.status(201).json(saveResult)
})

module.exports = blogsRouter