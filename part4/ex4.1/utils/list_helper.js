var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes,
    0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((curFave, blog) => {
    if (curFave.likes < blog.likes) {
      const newFave = {title: blog.title, author: blog.author, likes: blog.likes}
      return newFave
    } 
    return curFave
  },
  {title: blogs[0].title, author: blogs[0].author, likes: blogs[0].likes})
}

const mostBlogs = (blogs) => {
  const authorHistogram = _.countBy(blogs, (blog) => blog.author)
  let curMax = {author: "joke", blogs: -1}
  Object.keys(authorHistogram).forEach(
    (authorName) => {
      if (authorHistogram[authorName] > curMax.blogs) {
        curMax = {author: authorName, blogs: authorHistogram[authorName]}
      }
    }
  )
  return curMax
}

const mostLikes = (blogs) => {
  const byAuthor = _.groupBy(blogs, blog => blog.author)

  const totals = _.mapValues(byAuthor, (authorBlogs) => {
    return authorBlogs.reduce((likesSoFar, blog) => {
      return likesSoFar + blog.likes
    }, 0)
  })

  const totalsArray = Object.keys(totals).map(author => {
    return {author: author, likes: totals[author]}
  })

  return _.maxBy(totalsArray, (entry) => entry.likes)

}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}