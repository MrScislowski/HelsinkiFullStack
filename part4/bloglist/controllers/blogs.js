const blogsRouter = require('express').Router()

const Blog = require('../models/Blog')
const User = require('../models/User')


blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({}).populate('user')
  response.json(allBlogs)
})

blogsRouter.post('/', async (request, response) => {

  if (!('title' in request.body) || !('url' in request.body)) {
    return response.status(400).send()
  }

  // get a user id to assign to the blog
  const allUsers = await User.find({})
  const userId = allUsers[Math.floor(Math.random()*allUsers.length)]._id
  console.log(`userid ${userId} being used...`)


  const blog = new Blog({
    likes: request.body.likes || 0,
    user: userId,
    ...request.body
  })

  const savedBlog = await blog.save()

  const user = await User.findById(userId)

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