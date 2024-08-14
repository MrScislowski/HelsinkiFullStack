const blogsRouter = require('express').Router()

const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const Blog = require('../models/Blog')
const User = require('../models/User')

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({}).populate('user')
  response.json(allBlogs)
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// POST a new blog
blogsRouter.post('/', async (request, response) => {

  const token = getTokenFrom(request)
  if (!('title' in request.body) || !('url' in request.body) || !token) {
    return response.status(401).send({ 'error': 'title & url for blog required, and authorization token required' })
  }

  // throws an error if token isn't valid which is caught by middleware
  const userFromToken = jwt.verify(token, config.SECRET)

  const blog = new Blog({
    likes: request.body.likes || 0,
    user: userFromToken.id,
    ...request.body
  })

  const savedBlog = await blog.save()

  const user = await User.findById(userFromToken.id)

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
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