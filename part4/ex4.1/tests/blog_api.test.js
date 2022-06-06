const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const createUserResponse = await api
    .post('/api/users')
    .send({
      username: helper.testUser.username,
      name: helper.testUser.name,
      password: helper.testUser.password,
    })

  await Blog.deleteMany({})
  
  const allPromises = helper.blogList.map((b) => (new Blog(b)).save())
  await Promise.all(allPromises)
})

describe('when getting posts', () => {
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
})

describe('when posting blogs', () => {
  test('missing authorization token results in 401 error', async () => {
    await api
      .post('/api/blogs')
      .send(helper.oneExtraBlog)
      .expect(401)
  })


  test('# blogs in DB increases by 1, and saves its content', async () => {
    const blogsBefore = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const loginResponse = await api
    .post('/api/login')
    .send({
      username: helper.testUser.username,
      password: helper.testUser.password,
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token
    expect(token).toBeDefined()


    const postResponse = await api
      .post('/api/blogs')
      .send(helper.oneExtraBlog)
      .set('Authorization', `bearer ${token}`)
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
  
  test('missing likes in post defaults to zero', async () => {
    const {likes, ...incompleteObject} = helper.oneExtraBlog

    const loginResponse = await api
    .post('/api/login')
    .send({
      username: helper.testUser.username,
      password: helper.testUser.password,
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token
    expect(token).toBeDefined()
    // .set('Authorization', `bearer ${token}`)

    const postResponse = await api
      .post('/api/blogs')
      .send(incompleteObject)
      .set('Authorization', `bearer ${token}`)
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
  
  test('missing title and url constitute Bad Request', async () => {
    let {title, url, ...missingBoth} = helper.oneExtraBlog
    
    const loginResponse = await api
    .post('/api/login')
    .send({
      username: helper.testUser.username,
      password: helper.testUser.password,
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token
    expect(token).toBeDefined()
    
    
    await api
      .post('/api/blogs')
      .send(missingBoth)
      .set('Authorization', `bearer ${token}`)
      .expect(400)
  })
})

describe('when deleting a blog', () => {
  test('correct id => one fewer blog; specified blog no longer there', async () => {
    let blogsBefore = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    blogsBefore = blogsBefore.body
    
    const blogToDelete = blogsBefore[Math.floor(Math.random() * blogsBefore.length)]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    let blogsAfter = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    blogsAfter = blogsAfter.body

    // one fewer blog
    expect(blogsAfter).toHaveLength(blogsBefore.length - 1)

    // specified blog no longer there
    expect(blogsBefore.find((b) => b.id === blogToDelete.id)).not.toBeUndefined()
    expect(blogsAfter.find((b) => b.id === blogToDelete.id)).toBeUndefined()

  })

  test('nonexistent id => fails with status code 404', async () => {
    let blogsBefore = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    blogsBefore = blogsBefore.body

    await api
      .delete(`/api/blogs/${blogsBefore[0].id}`)
      .expect(204)
    
    await api
      .delete(`/api/blogs/${blogsBefore[0].id}`)
      .expect(404)
  })

})

describe('when updating a blog', () => {
  test('number of blogs the same; content has changed', async () => {
    let allBlogsV1 = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    allBlogsV1 = allBlogsV1.body

    const updatedBlog = helper.generateRandomBlog()
    await api
      .put(`/api/blogs/${allBlogsV1[0].id}`)
      .send(updatedBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let allBlogsV2 = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
    allBlogsV2 = allBlogsV2.body

    expect(allBlogsV2).toHaveLength(allBlogsV1.length)
    expect(allBlogsV2.find((b) => b.id === allBlogsV1[0].id)).toEqual({id: allBlogsV1[0].id, ...updatedBlog})


  })
})

afterAll(() => {
  mongoose.connection.close()
})