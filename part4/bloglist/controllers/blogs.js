const blogsRouter = require('express').Router()
// eslint-disable-next-line no-unused-vars
const logger = require('../utils/logger')

const Blog = require('../models/Blog')
const User = require('../models/User')

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    _id: 1,
  })
  response.json(allBlogs)
})

// POST a new blog
blogsRouter.post('/', async (request, response) => {
  if (!('title' in request.body) || !('url' in request.body)) {
    return response
      .status(400)
      .send({ error: 'title & url for blog required' })
  }

  const userFromToken = request.user
  if (!userFromToken) {
    return response.status(401).send({ error: 'authorization token required' })
  }

  const blog = new Blog({
    likes: request.body.likes || 0,
    user: userFromToken.id,
    comments: [],
    ...request.body,
  })

  const savedBlog = await blog.save()

  const user = await User.findById(userFromToken.id)

  if (!user) {
    return response
      .status(500)
      .json({ error: 'could not find user referenced by token' })
  }

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const savedPopulatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
    _id: 1,
  })
  response.status(201).json(savedPopulatedBlog)
})

// DELETE a blog
blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id

  const userFromToken = request.user
  if (!userFromToken) {
    return response.status(401).send({ error: 'authorization token required' })
  }

  // check if it's authorized (user id of blog is the same as id from token)
  const blogEntry = await Blog.findById(blogId)
  if (!blogEntry) {
    return response.status(404).send({ error: 'cannot find that blog' })
  }

  if (blogEntry.user._id.toString() !== request.user.id) {
    return response
      .status(403)
      .send({ error: 'you dont have permission to remove this blog' })
  }

  // TODO: could I have done blogEntry.deleteOne() or something like that? Since I've already found it
  const dbResponse = await Blog.findByIdAndDelete(blogId)

  if (dbResponse) {
    response.status(204).send()
  } else {
    response.status(404).send()
  }
})

// UPDATE a blog using PUT
blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id

  const userFromToken = request.user
  if (!userFromToken) {
    return response.status(401).send({ error: 'authorization token required' })
  }

  const blogEntry = await Blog.findById(id)
  if (!blogEntry) {
    return response.status(404).send()
  }

  // TODO: will this automatically raise an exception if something is missing?
  const { title, author, url, likes, user } = request.body

  const updatedBlogEntry = {
    title,
    author,
    url,
    user,
    likes,
  }

  const dbResponse = await Blog.findByIdAndUpdate(id, updatedBlogEntry, {
    new: true,
    runValidators: true,
    context: 'query',
  })

  if (dbResponse) {
    response.status(200).json(dbResponse)
  } else {
    response.status(404).send()
  }
})

// POST comments
blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body

  await Blog.updateOne(
    { _id: request.params.id },
    {
      $push: { comments: comment },
    }
  )

  response.status(201).send()
})

module.exports = blogsRouter
