const { test, after, beforeEach, describe } = require('node:test')
const _ = require('lodash')
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

describe.only('GET user api tests on backend', async () => {
  test('correct number of users returned', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, initialUsers.length)
  })

  test('user data has fields: "username", "name", "id", an no more', async () => {
    const response = await api.get('/api/users')
    const allBlogs = response.body

    const requiredFields = ['username', 'name', 'id']

    assert.ok(allBlogs.every(user => _.isEqual(Object.getOwnPropertyNames(user), requiredFields)))
  })
})

after(async () => {
  await mongoose.connection.close()
})