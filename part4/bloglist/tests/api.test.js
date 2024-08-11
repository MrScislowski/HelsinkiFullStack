const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/Blog')

const api = supertest(app)

const generateRandomString = () => {
  return Math.random().toString(36).slice(2)
}

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

  test('blog posts have "id" field, not "_id" field', async () => {
    const response = await api.get('/api/blogs')
    // const allBlogs = JSON.parse(response.body)
    const allBlogs = response.body

    assert.strictEqual(allBlogs.every(blog => 'id' in blog && !('_id' in blog)), true, `blog with _id instead of id: ${JSON.stringify(allBlogs, null, 2)}`)
  })

  test('posting a new blog increases the number in the DB by one', async () => {
    const blogsBefore = (await api.get('/api/blogs')).body
    await api.post('/api/blogs').send({
      title: generateRandomString(),
      author: generateRandomString(),
      url: generateRandomString(),
    })
    const blogsAfter = (await api.get('/api/blogs')).body
    assert.strictEqual(blogsBefore.length + 1, blogsAfter.length)
  })

  test('the contents of the created blog are faithful to intention', async () => {
    const blogsBefore = (await api.get('/api/blogs')).body

    const title = generateRandomString()
    const author = generateRandomString()
    const url = generateRandomString()
    const newBlog = {
      title, author, url
    }

    await api.post('/api/blogs').send(newBlog)

    const blogsAfter = (await api.get('/api/blogs')).body

    const foundBefore = blogsBefore.find(blog => blog.title === title && blog.author === author && blog.url === url)
    const foundAfter = blogsAfter.find(blog => blog.title === title && blog.author === author && blog.url === url)
    assert.strictEqual(foundBefore, undefined, 'shouldnt find the created blog before its posted')
    assert.ok('id' in foundAfter, `blogsAfter should have contained ${JSON.stringify(newBlog, null, 2)}. Blogs after was: ${JSON.stringify(blogsAfter, null, 2)}`)
  })
})

after(async () => {
  await mongoose.connection.close()
})