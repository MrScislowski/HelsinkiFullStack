const blogsRouter = require('express').Router()

const Blog = require('../models/Blog')

blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({})
  response.json(allBlogs)
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter