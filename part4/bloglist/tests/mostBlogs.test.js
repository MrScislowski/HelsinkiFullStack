const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const { blogs } = require('./testData')

describe.skip('most blogs', () => {
  test('fowler has the most blogs', () => {
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }

    assert.deepStrictEqual(listHelper.mostBlogs(blogs), expected)
  })

  test('when theres only one blog, that author wins', () => {
    const singleBloglist = [{
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }]

    assert.deepStrictEqual(listHelper.mostBlogs(singleBloglist), { author: singleBloglist[0].author, blogs: 1 })
  })

  test('when there are no blogs, there is no winner', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), null)
  })

})
