import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])



  // If user is not logged in, only login form is visible
  const [user, setUser] = useState(null)
  const handleLogin = () => {
    setUser(`User #${Math.floor(Math.random() * 10)}`)
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        Click on the button to be logged in
        <button>Log in</button>
      </form>
    )
  }

  const userInfo = () => {
    return (
    <p> Logged in as: {user} </p>
    )
  }

  const blogList = () => {
    return (
      <div>
        <h2>blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
      </div>
    )
  }

  return (
  <>
    {user && userInfo()}
    {user && blogList()}
    {!user && loginForm()}
  </>
  )

}

export default App