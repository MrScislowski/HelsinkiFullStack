const blogsRouter = require('express').Router()

const Blog = require('../models/Blog')

blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({})
  response.json(allBlogs)
})

blogsRouter.post('/', async (request, response) => {

  if (!('title' in request.body) || !('url' in request.body)) {
    return response.status(400).send()
  }

  const blog = new Blog({
    likes: request.body.likes || 0,
    ...request.body
  })

  const saveResult = await blog.save()

  response.status(201).json(saveResult)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  const dbResponse = await Blog.findByIdAndDelete(id)

  if (dbResponse) {
    response.status(204).send()
  } else {
    response.status(404).send()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id

  const dbResponse = await Blog.findByIdAndUpdate(id, request.body,  { new: true, runValidators: true, context: 'query' })

  if (dbResponse) {
    response.status(200).send()
  } else {
    response.status(404).send()
  }
})

module.exports = blogsRouter