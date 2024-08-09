const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite =  blogs.reduce((favorite, curBlog) => curBlog.likes > favorite.likes ? curBlog : favorite, blogs[0])
  const { title, author, likes } = favorite
  return { title, author, likes }
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}