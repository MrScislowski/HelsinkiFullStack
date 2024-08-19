import { useState, useRef } from 'react'
import blogService from '../services/blogs'
import Togglable from './Togglable'


const NewBlogForm = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const newBlogFormRef = useRef()

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()

    try {
      const response = await blogService.postNew({ title, author, url })

      setTitle('')
      setAuthor('')
      setUrl('')

      newBlogFormRef.current.toggleVisibility()

      props.setNotification({
        message: `added new blog`,
        data: { title: response.title, author: response.author },
        type: "info"
      })
      setTimeout(() => props.setNotification(null), 3000)

      props.setBlogs(props.blogs.concat(response).sort((a, b) => a.likes - b.likes))
    } catch (e) {
      console.dir(e)
    }
  }

  return (
    <>
    <Togglable buttonLabel='new blog' ref={newBlogFormRef}>
      <h2>create new</h2>
      <form onSubmit={handleCreateNewBlog}>
        <span>
          title:
          <input type='text' onChange={(e) => setTitle(e.target.value)} />
        </span>
        <br />
        <span>
          author:
          <input type='text' onChange={(e) => setAuthor(e.target.value)} />
        </span>
        <br />
        <span>
          url:
          <input type='text' onChange={(e) => setUrl(e.target.value)} />
        </span>
        <br />
        <button type='submit'>create</button>

      </form>
      </Togglable>
    </>
  )
}

export default NewBlogForm