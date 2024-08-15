const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const { blogs } = require('./testData')

describe.skip('favorite blog', () => {
  test('dijkstra is the favorite', () => {
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }

    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), expected)
  })

  test('if there is just one blog, it is the favorite', () => {
    const onlyOne = {
      title: 'sample blog',
      author: 'nobody',
      likes: 22
    }

    assert.deepStrictEqual(listHelper.favoriteBlog([onlyOne]), onlyOne)
  })

  test('if there are no blogs, there are no favorites', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), null)
  })

})
