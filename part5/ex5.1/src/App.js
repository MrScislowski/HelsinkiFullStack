import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    setUser(username)
  }

  const loginForm = () => (
      <>
      <h2> log in to application</h2>
      <form onSubmit={handleLogin}>
      username <input type="text" value={username} onChange={({target}) => setUsername(target.value)} /> <br/>
      password <input type="password" value={password} onChange={({target}) => setPassword(target.value)} /> <br />
      <button type="submit"> login </button>
      </form>
      </>
    )

  const blogsDisplay = () => (
      <>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </>
    )

  const loginStatusDisplay = () => (
    <p>{user} logged in</p>
  )

  return (
    <div>
      {user === null?
      loginForm() :
      <>
      {loginStatusDisplay()}
      {blogsDisplay()}
      </>
      }
    </div>
  )
}

export default App
