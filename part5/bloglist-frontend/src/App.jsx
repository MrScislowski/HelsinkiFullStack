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
  const [notification, setNotification] = useState(null)
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.attemptLogin(username, password)
      localStorage.setItem('loggedInBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (e) {
      // TODO: just discovered the 'response' property on the Axios error object isn't enumerable... wtf
      // Adjust the following to take care of that.
      if (e.response && e.response.data) {
        console.log('heres a response with data...')
        console.log(JSON.stringify(e.response.data, null, 2))
      } else {
        console.log('unexpected error', e)
      }
      setNotification({message: JSON.stringify(e, null, 2), type: 'error'})
      // setTimeout(() => {setNotification(null)}, 3000)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedInBloglistUser')
    setUser(null)
  }

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()

    try {
      const response = await blogService.postNew({ title, author, url })

      setTitle('')
      setAuthor('')
      setUrl('')

      setNotification({
        message: `added new blog`,
        data: { title: response.title, author: response.author },
        type: "info"
      })
      setTimeout(() => setNotification(null), 3000)
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

  const notificationPane = () => {
    const notificationData = () => {
      return <ul>
        {Object.entries(notification.data).map(([k, v]) => {
          return <li key={k}>{k}: {v}</li>
        })}
      </ul>
    }

    const infoStyle = {
      padding: 10,
      backgroundColor: "green",
      color: "white",
      borderStyle: "solid",
    };

    const errorStyle = {
      padding: 10,
      backgroundColor: "red",
      color: "white",
      borderStyle: "solid",
    }

    let chosenStyle = infoStyle

    if (notification.type === "info") {
      chosenStyle = infoStyle
    } else if (notification.type === "error") {
      chosenStyle = errorStyle
    }

    return (
      <div style={chosenStyle}>
        <p>{notification.message}</p>
        {notification.data && notificationData()}
      </div>
    )
  }

  return (
    <>
      {notification && notificationPane()}
      {!user && loginForm()}
      {user && userInfo()}
      {user && createNewBlogForm()}
      {user && blogList()}
    </>
  )

}

export default App