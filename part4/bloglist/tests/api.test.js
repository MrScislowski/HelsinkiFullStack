const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/Blog')

const api = supertest(app)

// strip the old ids etc from the test data
const initialBlogs = require('./testData').blogs.map(
  ({ title, author, url, likes }) => {
    return {
      title, author, url, likes
    }})

beforeEach(async () => {
  await Blog.deleteMany({})

  await Promise.all(
    initialBlogs.map(blog => new Blog(blog).save())
  )
})

describe('api tests on backend', async () => {
  test('blogs are returned in json format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})