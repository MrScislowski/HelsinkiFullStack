import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loginDetailsJSON = window.localStorage.getItem('blogUserLogin')
    if (loginDetailsJSON) {
      const loginDetails = JSON.parse(loginDetailsJSON)
      setUser(loginDetails)
      blogService.setToken(loginDetails.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await loginService.attemptLogin({username, password})
      blogService.setToken(response.token)
      setUser(response)
      window.localStorage.setItem('blogUserLogin', JSON.stringify(response))
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      console.log('login failed with exception: ', exception)
    }
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
    <p>{user.name} logged in</p>
  )

  const clearLoginInfo = () => {
    window.localStorage.removeItem('blogUserLogin')
    
    setUser(null)
  }

  const logoutButtonDisplay = () => (
    <button onClick={clearLoginInfo}> logout </button>
  )

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()
    const newBlog = await blogService.postBlog(
      {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
        likes: 0,
    })
    setBlogs(blogs.concat(newBlog))
  }

  const newBlogForm = () => (
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreateNewBlog}>
        title: <input type="text" value={blogTitle} onChange={({ target }) => setBlogTitle(target.value)} /> <br />
        author: <input type="text" value={blogAuthor} onChange={({ target }) => setBlogAuthor(target.value)} /> <br />
        url: <input type="text" value={blogUrl} onChange={({ target }) => setBlogUrl(target.value)} /> <br />
        <button type="submit">create</button>
      </form>
    </>
  )

  return (
    <div>
      {user === null?
      loginForm() :
      <>
      {loginStatusDisplay()}
      {logoutButtonDisplay()}
      {newBlogForm()}
      {blogsDisplay()}
      </>
      }
    </div>
  )
}

export default App
