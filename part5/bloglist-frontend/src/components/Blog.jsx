import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs }) => {
  const blogStyle = {
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    padding: 5,
  }

  const [showDetails, setShowDetails] = useState(false)

  const toggleButton = () => {
    return <button onClick={() => setShowDetails(!showDetails)}>
      {showDetails ? 'hide' : 'show'}
    </button>
  }

  const handleLike = async () => {
    const amendedBlog = await blogService.putAmended({...blog, likes: blog.likes + 1})
    setBlogs(blogs.map(b => {
      if (b.id !== amendedBlog.id) {
        return b
      } else {
        return {
          ...amendedBlog,
          user: b.user,
        }
      }
    }).sort((a, b) => a.likes - b.likes))
  }

  const likeButton = () => <button onClick={handleLike}>like</button>

  const details = () => <ul>
    <li>{blog.url}</li>
    <li> likes: {blog.likes} {likeButton()}</li>
    <li> {blog.user.name} </li>
  </ul>

  return (
    <div style={blogStyle}>
      <span>{blog.title} {blog.author} {toggleButton()} </span>
      {showDetails && details()}
    </div>
  )
}

export default Blog