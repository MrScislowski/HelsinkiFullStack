import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [detailsShown, setDetailsShown] = useState(false)

  const toggleVisibility = () => {
    setDetailsShown(!detailsShown)
  }

  const likeBlog = () => {
    const {title, author, url, likes, user, id} = blog
    const updatedBlog = {
      title,
      author,
      url,
      id,
      likes: likes + 1,
      user: user.id,
    }
    updateBlog(updatedBlog)
  }

  const showWhenVisible = { display: detailsShown ? '' : 'none' }

  const buttonText = (detailsShown) ? 'hide' : 'view'

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{buttonText}</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url} <br/>
        likes {blog.likes} <button onClick={likeBlog}>like</button> <br />
        {(blog.user) ? blog.user.name: ''}
      </div>
    </div>
  )
}

export default Blog