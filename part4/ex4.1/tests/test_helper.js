const { raw } = require('express')
const blog = require('../models/blog')
const Blog = require('../models/blog')

// title: String,
// author: String,
// url: String,
// likes: Number

const rawBlogList = [
  {
    title: "blog #1",
    author: "author #1",
    url: "url # 1",
    likes: 23,
  },
  {
    title: "blog #2",
    author: "author #2",
    url: "url # 2",
    likes: 233,
  },
  {
    title: "blog #3",
    author: "author #3",
    url: "url #3",
    likes: 2,
  },
  {
    title: "blog #4",
    author: "author #4",
    url: "url #4",
    likes: 8,
  },
]

const blogList = rawBlogList.map((b) => new Blog(b))

module.exports = {
  blogList,
}