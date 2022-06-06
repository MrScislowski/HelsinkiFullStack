const supertest = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/user')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const allPromises = helper.userList.map((u) => (new User(u)).save())
  await Promise.all(allPromises)
})

describe('when creating a new user', () => {
  test('valid entry is correctly saved', async () => {
    let usersBefore = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    usersBefore = usersBefore.body

    const dbResponse = await api
      .post('/api/users')
      .send(helper.oneExtraUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let usersAfter = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      usersAfter = usersAfter.body

    expect(usersAfter).toHaveLength(usersBefore.length + 1)
  })

  test('entry with existing username will not be created', async () => {
    let usersBefore = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    usersBefore = usersBefore.body

    const dbResponse = await api
      .post('/api/users')
      .send({
        username: usersBefore[0].username,
        name: "asdfasdfasdf",
        password: "asdfasdfasdf"
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(dbResponse.body.error).toContain('username already taken')

    let usersAfter = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      usersAfter = usersAfter.body

    expect(usersAfter).toHaveLength(usersBefore.length)
  })


})