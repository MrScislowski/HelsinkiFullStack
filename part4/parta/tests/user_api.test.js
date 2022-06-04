const bcrypt = require('bcrypt')
const { application } = require('express')
const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const helper = require('./test_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const hash = await bcrypt.hash("myPassword", 10)

    const rootUser = new User({
      username: 'root',
      passwordHash: hash,
    })

    await rootUser.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'user1',
      name: 'name1',
      password: 'hewo',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username) 
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'user2',
      password: 'pw2',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toEqual(usersBefore)
  })
})