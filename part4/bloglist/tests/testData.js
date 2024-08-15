const bcrypt = require('bcrypt')

const usersContent = [
  {
    username: 'user1',
    password: 'pw1',
    passwordHash: bcrypt.hashSync('pw1', 10),
    name: 'First User',
    blogs: [],
  },
  {
    username: 'user2',
    password: 'pw2',
    passwordHash: bcrypt.hashSync('pw1', 10),
    name: 'Second User',
    blogs: [],
  }
]

const blogsContent = [
  {
    title: 'First users first blog',
    author: 'is',
    url: 'stroke',
    user: 'user1',
    likes: Math.floor(Math.random() * 20),
  },
  {
    title: 'Second users first blog',
    author: 'house',
    url: 'east',
    user: 'user2',
    likes: Math.floor(Math.random() * 20),
  },
  {
    title: 'First users second blog',
    author: 'mountain',
    url: 'foreigner',
    user: 'user1',
    likes: Math.floor(Math.random() * 20),
  },
  {
    title: 'First users third blog',
    author: 'burial',
    url: 'violation',
    user: 'user1',
    likes: Math.floor(Math.random() * 20),
  },
]

module.exports = { usersContent, blogsContent }