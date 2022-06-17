import Togglable from './Togglable'
import { useState } from 'react'


const AddBlogForm = ({ newBlogFormRef, addBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()
    const blogObject =
      {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
        likes: 0,
      }
    await addBlog(blogObject)
  }

  return (
    <>
      <Togglable startingVisibility={false} buttonLabel='add new blog' ref={newBlogFormRef}>
        <h2>create new</h2>
        <form onSubmit={handleCreateNewBlog}>
          title: <input type="text" value={blogTitle} onChange={({ target }) => setBlogTitle(target.value)} /> <br />
          author: <input type="text" value={blogAuthor} onChange={({ target }) => setBlogAuthor(target.value)} /> <br />
          url: <input type="text" value={blogUrl} onChange={({ target }) => setBlogUrl(target.value)} /> <br />
          <button type="submit">create</button>
        </form>
      </Togglable>
    </>
  )
}

export default AddBlogForm