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
  const allPromises = helper.blogList.map((b) => (new Blog(b)).save())
  await Promise.all(allPromises)
})

test('gets correct number of blogs in json', async () => {
  const returnedBlogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  expect(returnedBlogs.body).toHaveLength(helper.blogList.length)
})

test('each blog has an "id" property', async () => {
  const returnedBlogs = await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)

  returnedBlogs.body.forEach((blog) => expect(blog.id).toBeDefined())
})

test('posting blog increases # blogs in DB by 1, and saves its content', async () => {
  const blogsBefore = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const postResponse = await api
    .post('/api/blogs')
    .send(helper.oneExtraBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(blogsAfter.body).toHaveLength(blogsBefore.body.length + 1)

  const resultBlogsContent = blogsAfter.body.map(b => b.content)
  expect(resultBlogsContent).toContain(helper.oneExtraBlog.content)
})

test.only('missing likes in post defaults to zero', async () => {
  const {likes, ...incompleteObject} = helper.oneExtraBlog
  const postResponse = await api
    .post('/api/blogs')
    .send(incompleteObject)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const allBlogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const dbEntry = allBlogs.body.find((blog) => blog.id === postResponse.body.id)
  expect(dbEntry.likes).toBeDefined()
  expect(dbEntry.likes).toBe(0)
})