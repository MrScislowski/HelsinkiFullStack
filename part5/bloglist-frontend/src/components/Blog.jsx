import { useState } from 'react'

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

  const likeButton = () => <button onClick={() => alert('to be implemented')}>like</button>

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