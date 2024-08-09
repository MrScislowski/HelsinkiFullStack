const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const { blogs } = require('./testData')

describe('most likes', () => {
  test('dijkstra has the most likes', () => {
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    assert.deepStrictEqual(listHelper.mostLikes(blogs), expected)
  })

  test('when theres only one blog, thats the number of likes', () => {
    const singleBloglist = [{
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }]

    assert.deepStrictEqual(listHelper.mostLikes(singleBloglist), { author: singleBloglist[0].author, likes: singleBloglist[0].likes })
  })

  test('when there are no blogs, there is no winner', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), null)
  })

})
