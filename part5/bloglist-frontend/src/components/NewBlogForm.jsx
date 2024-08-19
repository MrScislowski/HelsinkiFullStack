import { useState, useRef } from 'react'
import blogService from '../services/blogs'
import Togglable from './Togglable'


const NewBlogForm = ({ blogs, setBlogs, setNotification }) => {
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

      setNotification({
        message: `added new blog`,
        data: { title: response.title, author: response.author },
        type: "info"
      })
      setTimeout(() => setNotification(null), 3000)

      console.log('about to add the following response to the blog list...')
      console.log(response)
      console.log('the blogs already in the list are:')
      console.log(blogs)


      setBlogs(blogs.concat(response).sort((a, b) => a.likes - b.likes))
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