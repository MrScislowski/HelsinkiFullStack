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

  const retval = await Blog.findByIdAndRemove(theId)
  if (retval) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  console.log('got:', request.body)
  const amendedBlog = (({title, author, url, likes}) => ({title, author, url, likes}))(request.body)
  console.log('turned that into:', amendedBlog)
  const retVal = await Blog.findByIdAndUpdate(request.params.id, 
    amendedBlog, 
    {runValidators: true, returnDocument: 'after'})
  if (retVal) {
    response.status(201).json(retVal)
  } else {
    response.status(404).end()
  }

})

module.exports = blogsRouter