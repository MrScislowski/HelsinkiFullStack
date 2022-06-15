import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
// import Togglable from './components/Togglable'
import AddBlogForm from './components/AddBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({type: null, message: null})

  const newBlogFormRef = useRef()


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
      setNotification(
        {
          type: 'error',
          message: 'wrong username or password',
        }
      )
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

  const blogsDisplay = () => {
    const sortedBlogs = [...blogs]
    sortedBlogs.sort((a, b) => {
      if (a.likes > b.likes) {
        return 1
      } else if (a.likes < b.likes) {
        return -1
      } else {
        return 0
      }
    })

    return (
      <>
        <h2>blogs</h2>
        {sortedBlogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={deleteBlog} user={user} />
        )}
      </>
    )
  }



  const loginStatusDisplay = () => (
    <p>{user.name} logged in</p>
  )

  const clearLoginInfo = () => {
    window.localStorage.removeItem('blogUserLogin')
    
    setUser(null)
  }

  const logoutButtonDisplay = () => (
    <p>
    <button onClick={clearLoginInfo}> logout </button>
    </p>
  )

  const addBlog = async (blogObject) => {
    const newBlog = await blogService.postBlog(blogObject)
    setBlogs(blogs.concat(newBlog))
    newBlogFormRef.current.toggleVisibility()
    setNotification(
      {
        type: 'info',
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      })
  }

  const updateBlog = async (updatedBlogObject) => {
    const updatedBlog = await blogService.amendBlog(updatedBlogObject)
    setBlogs(blogs.map((b) => (b.id === updatedBlog.id)? updatedBlog : b))
    setNotification(
      {
        type: 'info',
        message: `blog "${updatedBlog.title}" by ${updatedBlog.author} liked`,
      })
  }

  const deleteBlog = async (blogObject) => {
    const confirmed = window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)

    if (!confirmed) {
      return
    }

    const response = await blogService.deleteBlog(blogObject)
    setBlogs(blogs.filter((b) => (b.id !== response.id)))
    setNotification(
      {
        type: 'info',
        message: `blog "${blogObject.title}" by ${blogObject.author} removed`,
      }
    )
  }

  

  const notificationDisplay = () => {
    if (notification.type === null) {
      return <></>
    }
    setTimeout(() => {
      setNotification({type: null, message: null})
    }, 5000)
    return (
      <>
      <p className={notification.type}>{notification.message}</p>
      </>
    )
  }

  return (
    <div>
      {notificationDisplay()}
      {user === null?
      loginForm() :
      <>
      {loginStatusDisplay()}
      {logoutButtonDisplay()}
      <AddBlogForm newBlogFormRef={newBlogFormRef} addBlog={addBlog} />
      {blogsDisplay()}
      </>
      }
    </div>
  )
}

export default App
