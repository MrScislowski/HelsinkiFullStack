const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/Blog')
const User = require('../models/User')
const testData = require('./testData')
// eslint-disable-next-line no-unused-vars
const logger = require('../utils/logger')

const api = supertest(app)

const generateRandomString = () => {
  return Math.random().toString(36).slice(2)
}

let user1Token
let userIds


beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  // will contain ids for each user in DB; e.g. {'user1': 'lkdjaf98e892fsa', 'user2': 98fjkdlf28fds'}
  userIds = {}
  for (let userData of testData.usersContent) {
    const createdUser = await (new User(userData)).save()
    userIds[userData.username] = createdUser._id
  }

  await Promise.all(
    testData.blogsContent.map(blog => {
      return (new Blog({ ...blog, user: userIds[blog.user] })).save()
    })
  )

  user1Token = (await api.post('/api/login').send({ username: 'user1', password: testData.usersContent[0].password })).body.token
})

describe('GET api tests on backend', async () => {
  test('blogs are returned in json format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs returned', async () => {
    const response = await api.get('/api/blogs').expect(200)
    assert.strictEqual(response.body.length, testData.blogsContent.length)
  })

  test('blog posts have "id" field, not "_id" field', async () => {
    const response = await api.get('/api/blogs').expect(200)
    // const allBlogs = JSON.parse(response.body)
    const allBlogs = response.body

    assert.strictEqual(allBlogs.every(blog => 'id' in blog && !('_id' in blog)), true, `blog with _id instead of id: ${JSON.stringify(allBlogs, null, 2)}`)
  })
})

describe('well-formed POST requests', async () => {
  test.only('posting a new blog increases the number in the DB by one', async () => {
    const blogsBefore = (await api.get('/api/blogs').expect(200)).body

    await api.post('/api/blogs')
      .set({ Authorization: user1Token })
      .send({
        title: generateRandomString(),
        author: generateRandomString(),
        url: generateRandomString(),
      }).expect(201)
    const blogsAfter = (await api.get('/api/blogs').expect(200)).body
    assert.strictEqual(blogsBefore.length + 1, blogsAfter.length)
  })

  test('the contents of the created blog are faithful to intention', async () => {
    const blogsBefore = (await api.get('/api/blogs').expect(200)).body

    const title = generateRandomString()
    const author = generateRandomString()
    const url = generateRandomString()
    const newBlog = {
      title, author, url
    }

    await api.post('/api/blogs').set({ Authorization: user1Token }).send(newBlog)

    const blogsAfter = (await api.get('/api/blogs').expect(200)).body

    const foundBefore = blogsBefore.find(blog => blog.title === title && blog.author === author && blog.url === url)
    const foundAfter = blogsAfter.find(blog => blog.title === title && blog.author === author && blog.url === url)
    assert.strictEqual(foundBefore, undefined, 'shouldnt find the created blog before its posted')
    assert.ok(foundAfter && 'id' in foundAfter, `blogsAfter should have contained ${JSON.stringify(newBlog, null, 2)}. Blogs after was: ${JSON.stringify(blogsAfter, null, 2)}`)
  })

  test('posting a blog missing likes defaults to zero', async () => {
    const title = generateRandomString()
    const author = generateRandomString()
    const url = generateRandomString()
    const newBlog = {
      title, author, url
    }

    await api.post('/api/blogs').set({ Authorization: user1Token }).send(newBlog)

    const blogsAfter = (await api.get('/api/blogs').expect(200)).body

    const createdBlog = blogsAfter.find(blog => blog.title === title && blog.author === author && blog.url === url)
    assert.ok(createdBlog, `Expected to find ${JSON.stringify(newBlog, null, 2)} in ${JSON.stringify(blogsAfter, null, 2)}`)
    assert.strictEqual(createdBlog.likes, 0)
  })
})

describe('malformed POST requests', async () => {
  test('missing title causes 400 response', async () => {
    const postBody = {
      author: generateRandomString(),
      url: generateRandomString(),
    }

    await api.post('/api/blogs').set({ Authorization: user1Token }).send(postBody).expect(400)
  })

  test('missing url causes 400 response', async () => {
    const postBody = {
      title: generateRandomString(),
      author: generateRandomString(),
    }

    await api.post('/api/blogs').set({ Authorization: user1Token }).send(postBody).expect(400)
  })
})

describe('DELETE requests', async () => {
  test('resource is removed after valid delete request', async () => {
    const allBlogsInitially = await Blog.find({})
    const myBlogs = await Blog.find({ user: userIds['user1'] })

    const blogToDelete = myBlogs[Math.floor(Math.random() * myBlogs.length)]
    await api.delete(`/api/blogs/${blogToDelete.id}`).set({ Authorization: user1Token }).expect(204)

    const allBlogsFinally = (await api.get('/api/blogs').expect(200)).body


    assert.strictEqual(allBlogsFinally.length + 1, allBlogsInitially.length)
    assert.strictEqual(allBlogsFinally.find(blog => blog.id === blogToDelete.id), undefined)
  })

  test('attempting to remove a nonexistent id gives status 404', async () => {
    const title = generateRandomString()
    const author = generateRandomString()
    const url = generateRandomString()
    const newBlog = {
      title, author, url
    }

    const blogInDB = (await api.post('/api/blogs').set({ Authorization: user1Token }).send(newBlog).expect(201)).body
    await api.delete(`/api/blogs/${blogInDB.id}`).set({ Authorization: user1Token }).expect(204)

    await api.delete(`/api/blogs/${blogInDB.id}`).set({ Authorization: user1Token }).expect(404)
  })

  test('attempting to remove an invalidly formatted id gives status 400', async () => {
    await api.delete('/api/blogs/notvalidid').set({ Authorization: user1Token }).expect(400)
  })
})

describe('PUT modification requests', async () => {
  test('incrementing likes works', async () => {
    const blogsBefore = (await api.get('/api/blogs').expect(200)).body

    const blogToModify = blogsBefore[Math.floor(Math.random() * blogsBefore.length)]

    await api.put(`/api/blogs/${blogToModify.id}`).send({ ...blogToModify, likes: blogToModify.likes + 1 }).expect(200)

    const blogsAfter = (await api.get('/api/blogs').expect(200)).body

    assert.strictEqual(blogsAfter.find(blog => blog.id === blogToModify.id).likes, blogToModify.likes + 1)

  })

  test('replacing title works', async () => {
    const blogsBefore = (await api.get('/api/blogs').expect(200)).body

    const blogToModify = blogsBefore[Math.floor(Math.random() * blogsBefore.length)]

    const newTitle = generateRandomString()

    await api.put(`/api/blogs/${blogToModify.id}`).send({ ...blogToModify, title: newTitle }).expect(200)

    const blogsAfter = (await api.get('/api/blogs').expect(200)).body

    assert.strictEqual(blogsAfter.find(blog => blog.id === blogToModify.id).title, newTitle)
  })

  test('trying to modify nonexistent resource gives 404', async () => {
    const title = generateRandomString()
    const author = generateRandomString()
    const url = generateRandomString()
    const newBlog = {
      title, author, url
    }

    const blogInDB = (await api.post('/api/blogs').set({ Authorization: user1Token }).send(newBlog).expect(201)).body
    await api.delete(`/api/blogs/${blogInDB.id}`).expect(204)

    await api.put(`/api/blogs/${blogInDB.id}`).send({ ...blogInDB, likes: 42 }).expect(404)
  })

  test('trying to modify bad id resource gives 400', async () => {
    const title = generateRandomString()
    const author = generateRandomString()
    const url = generateRandomString()
    const newBlog = {
      title, author, url
    }
    await api.put('/api/blogs/notavalidresource').send({ ...newBlog }).expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})