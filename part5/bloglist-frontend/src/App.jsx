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

  useEffect(() => {
    const savedLogin = localStorage.getItem('loggedInBloglistUser')
    if (savedLogin) {
      const savedUser = JSON.parse(savedLogin)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])


  // If user is not logged in, only login form is visible
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.attemptLogin(username, password)
      localStorage.setItem('loggedInBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (e) {
      console.log(e)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedInBloglistUser')
    setUser(null)
  }

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()

    try {
      const response = await blogService.postNew({title, author, url})

      setTitle('')
      setAuthor('')
      setUrl('')
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

  const createNewBlogForm = () => {
    return (
      <>
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
      </>
    )
  }

  const userInfo = () => {
    return (
      <p> Logged in as: {user.name} <button onClick={handleLogout}>Log out</button></p>
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
      {user && createNewBlogForm()}
      {user && blogList()}
    </>
  )

}

export default App