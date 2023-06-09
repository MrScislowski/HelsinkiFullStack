import { useState } from 'react'
import propTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
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

  const likeBlog = async () => {
    const { title, author, url, likes, user, id } = blog
    const updatedBlog = {
      title,
      author,
      url,
      id,
      likes: likes + 1,
      user: user.id,
    }
    await updateBlog(updatedBlog)
  }

  const removeThis = async () => {
    await removeBlog(blog)
  }

  const showWhenVisible = { display: detailsShown ? '' : 'none' }

  const buttonText = (detailsShown) ? 'hide' : 'view'


  const ownsPost = blog.user && blog.user.id === user.id
  const ownedStyle = { display: ownsPost ? '' : 'none' }

  return (
    <div style={blogStyle}>
      <div className='basic-blog-content' >
        {blog.title} {blog.author} <button className='visibility-button' onClick={toggleVisibility}>{buttonText}</button>
      </div>
      <div className='detailed-blog-content' style={showWhenVisible}>
        {blog.url} <br/>
        likes {blog.likes} <button className='like-button' onClick={likeBlog}>like</button> <br />
        {(blog.user) ? blog.user.name: ''} <br />
        <button style={ownedStyle} onClick={removeThis}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: propTypes.object.isRequired,
  updateBlog: propTypes.func.isRequired,
  removeBlog: propTypes.func.isRequired,
  user: propTypes.object.isRequired
}

export default Blog