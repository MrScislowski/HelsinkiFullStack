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

module.exports = {
  dummy, totalLikes, favoriteBlog
}