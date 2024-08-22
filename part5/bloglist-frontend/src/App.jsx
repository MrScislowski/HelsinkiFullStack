import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import NewBlogForm from './components/NewBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => a.likes - b.likes))
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

  const [notification, setNotification] = useState(null)
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.attemptLogin(username, password)
      localStorage.setItem('loggedInBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (e) {
      const details = e.response ? e.response.data : null
      setNotification({ message: e.message, type: 'error', data: details })
      setTimeout(() => {setNotification(null)}, 3000)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedInBloglistUser')
    setUser(null)
  }



  const loginForm = () => {
    return (
      <>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor='username'>
            username:
          </label>
          <input type='text' id='username' onChange={(e) => setUsername(e.target.value)} />
          <br />
          <label htmlFor='password'>
            password:
          </label>
          <input type='password' id='password' onChange={e => setPassword(e.target.value)} />
          <br />
          <button type='submit'>log in</button>
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
      <div id='blog-list'>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} setNotification={setNotification} />
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
      backgroundColor: 'green',
      color: 'white',
      borderStyle: 'solid',
    }

    const errorStyle = {
      padding: 10,
      backgroundColor: 'red',
      color: 'white',
      borderStyle: 'solid',
    }

    let chosenStyle = infoStyle

    if (notification.type === 'info') {
      chosenStyle = infoStyle
    } else if (notification.type === 'error') {
      chosenStyle = errorStyle
    }

    return (
      <div id='notification' style={chosenStyle}>
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
      {user && <NewBlogForm setNotification={setNotification} blogs={blogs} setBlogs={setBlogs} />}
      {user && blogList()}
    </>
  )

}

export default App