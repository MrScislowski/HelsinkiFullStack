const blogsRouter = require('express').Router()
// eslint-disable-next-line no-unused-vars
const logger = require('../utils/logger')

const Blog = require('../models/Blog')
const User = require('../models/User')

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({}).populate('user',
    { username: 1, name: 1, _id: 1 }
  )
  response.json(allBlogs)
})



// POST a new blog
blogsRouter.post('/', async (request, response) => {

  if (!('title' in request.body) || !('url' in request.body)) {
    return response.status(400).send({ 'error': 'title & url for blog required' })
  }

  const userFromToken = request.user
  if (!userFromToken) {
    return response.status(401).send({ 'error': 'authorization token required' })
  }

  const blog = new Blog({
    likes: request.body.likes || 0,
    user: userFromToken.id,
    ...request.body
  })

  const savedBlog = await blog.save()

  const user = await User.findById(userFromToken.id)

  if (!user) {
    return response.status(500).json({ 'error': 'could not find user referenced by token' })
  }

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// DELETE a blog
blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id

  // check if it's authorized (user id of blog is the same as id from token)
  const blogEntry = await Blog.findById(blogId)
  logger.info(`found blog entry: ${JSON.stringify(blogEntry, null, 2)}`)
  if (!blogEntry) {
    return response.status(404).send()
  }
  logger.info(`token user id is: ${JSON.stringify(request.user, null, 2)}`)
  logger.info(`blog user id is: ${JSON.stringify(blogEntry.user, null, 2)}`)

  if (blogEntry.user._id.toString() !== request.user.id) {
    return response.status(403).send()
  }

  // TODO: could I have done blogEntry.deleteOne() or something like that? Since I've already found it
  logger.info('about to delete the blog...')
  const dbResponse = await Blog.findByIdAndDelete(blogId)
  logger.info(`deleted... db response is: ${JSON.stringify(dbResponse, null, 2)}`)

  if (dbResponse) {
    response.status(204).send()
  } else {
    response.status(404).send()
  }
})

// UPDATE a blog using PUT
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