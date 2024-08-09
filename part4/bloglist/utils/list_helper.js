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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorHistogram = {}
  blogs.forEach(blog => {
    if (Object.hasOwn(authorHistogram, blog.author)) {
      authorHistogram[blog.author] += 1
    } else {
      authorHistogram[blog.author] = 1
    }
  })

  const authors = Object.keys(authorHistogram)

  const winner = authors.reduce((winningKey, blogKey) => {

    if (authorHistogram[blogKey] > authorHistogram[winningKey]) {
      return blogKey
    } else {
      return winningKey
    }
  }, authors[0])

  return {
    author: winner,
    blogs: authorHistogram[winner]
  }
}

// When I asked chatGPT to make this code more idiomatic it gave:
// const mostBlogs = (blogs) => {
//   if (blogs.length === 0) return null;

//   const authorHistogram = blogs.reduce((acc, { author }) => {
//     acc[author] = (acc[author] || 0) + 1;
//     return acc;
//   }, {});

//   const [author, blogsCount] = Object.entries(authorHistogram)
//     .reduce((max, entry) => entry[1] > max[1] ? entry : max);

//   return { author, blogs: blogsCount };
// }

// and claude.ai gave:
// const mostBlogs = (blogs) => {
//   if (blogs.length === 0) return null;

//   const authorHistogram = blogs.reduce((acc, blog) => {
//     acc[blog.author] = (acc[blog.author] || 0) + 1;
//     return acc;
//   }, {});

//   const [author, blogs] = Object.entries(authorHistogram).reduce(
//     ([maxAuthor, maxBlogs], [author, blogs]) =>
//       blogs > maxBlogs ? [author, blogs] : [maxAuthor, maxBlogs]
//   );

//   return { author, blogs };
// };

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null


  const authorHistogram = blogs.reduce((histogram, blog) => {
    histogram[blog.author] = (histogram[blog.author] || 0) + blog.likes
    return histogram
  }, {})


  const [author, likes] = Object.entries(authorHistogram)
    .reduce(([winningAuthor, winningLikes], [curAuthor, curLikes]) =>
      curLikes > winningLikes ? [curAuthor, curLikes] : [winningAuthor, winningLikes]
    )

  return {
    author,
    likes
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}