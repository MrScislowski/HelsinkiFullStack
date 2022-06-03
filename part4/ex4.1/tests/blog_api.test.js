/// <reference types="jest" />
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)


// http get request to /api/blogs; verify the blog list application return the correct amoutn of blog posts in json format
beforeEach(async () => {
  await Blog.deleteMany({})
  const allPromises = helper.blogList.map(b => b.save())
  await Promise.all(allPromises)
})

test('gets correct number of blogs in json', async () => {
  const returnedBlogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  expect(returnedBlogs.body).toHaveLength(helper.blogList.length)
})