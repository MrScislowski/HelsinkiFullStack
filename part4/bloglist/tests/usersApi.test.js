const { test, after, beforeEach, describe } = require('node:test')
require('lodash')
const bcrypt = require('bcrypt')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/User')

const api = supertest(app)

const generateRandomString = () => {
  return Math.random().toString(36).slice(2)
}

const initialUsers = [
  {
    username: 'root',
    password: 'opensesame',
    name: 'David Brent'
  },
]

beforeEach(async () => {
  await User.deleteMany({})

  await Promise.all(
    initialUsers.map(async ({ username, name, password }) => {
      const passwordHash = await bcrypt.hash(password, 10)
      return new User({ name, username, passwordHash }).save()
    })
  )
})

describe('GET user api tests on backend', async () => {
  test('correct number of users returned', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, initialUsers.length)
  })

})

describe.only('POST user api tests on backend', async () => {
  test('posting a new user causes that new user to be created', async () => {
    const usersBefore = (await api.get('/api/users')).body

    const newUser = {
      username: generateRandomString(),
      password: generateRandomString(),
      name: generateRandomString(),
    }

    await api.post('/api/users').send(newUser).expect(201)

    const usersAfter = (await api.get('/api/users')).body

    assert.strictEqual(usersBefore.length + 1, usersAfter.length)
    assert.strictEqual(usersBefore.find(user => user.username === newUser.username), undefined)
    assert.strictEqual(usersAfter.find(user => user.username === newUser.username).name, newUser.name)
  })

  test('posting duplicate usernames is forbidden', async () => {
    const newUser = {
      username: generateRandomString(),
      password: generateRandomString(),
      name: generateRandomString(),
    }

    await api.post('/api/users').send(newUser).expect(201)
    await api.post('/api/users').send(newUser).expect(400)
  })

  test('username must be long enough', async () => {
    const newUser = {
      username: 'ab',
      password: generateRandomString(),
      name: generateRandomString(),
    }

    await api.post('/api/users').send(newUser).expect(400)
  })

  test('password must be long enough', async () => {
    const newUser = {
      username: generateRandomString(),
      password: 'cd',
      name: generateRandomString(),
    }

    await api.post('/api/users').send(newUser).expect(400)
  })

})

after(async () => {
  await mongoose.connection.close()
})