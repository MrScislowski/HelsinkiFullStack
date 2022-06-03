const blogsRouter = require('express').Router()
const res = require('express/lib/response')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  response.json(await Blog.find({}))
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title && !request.body.url) {
    return response.status(400).end()
  }

  const blog = new Blog({
    likes: request.body.likes ? request.body.likes : 0,
    ...request.body
  })

  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const theId = request.params.id

  await Blog.findByIdAndRemove(theId)
  response.status(204).end()
})

module.exports = blogsRouter