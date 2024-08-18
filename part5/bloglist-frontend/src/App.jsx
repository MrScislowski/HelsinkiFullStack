import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])



  // If user is not logged in, only login form is visible
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.attemptLogin(username, password)
      setUser(user)
    } catch (e) {
      console.log(e)
    }

    }

  const loginForm = () => {
    return (
      <>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <span>
            username:
            <input type='text' onChange={(e) => setUsername(e.target.value)} />
          </span>
          <br />
          <span>
            password:
            <input type='password' onChange={e => setPassword(e.target.value)} />
          </span>
          <br />
          <button type='submit'>log in</button>
        </form>
      </>
    )
  }

  const userInfo = () => {
    return (
      <p> Logged in as: {user.name} </p>
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
      {!user && loginForm()}
      {user && userInfo()}
      {user && blogList()}
    </>
  )

}

export default App