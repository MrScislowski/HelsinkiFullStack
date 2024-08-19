import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
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
    await blogService.putAmended({...blog, likes: blog.likes + 1})
    // TODO: we should cause a data fetch to run again, or update the state of the blogs ourselves
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