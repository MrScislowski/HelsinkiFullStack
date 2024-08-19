### Simple React Login Form (Using Tokens)

`noteService.js`:
```js
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}
```

`*.jsx`:
```js
const handleLogin = (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({username, password})
    noteService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  }
}

return (
  <form onSubmit={handleLogin}>

  </form>
)
```

### Conditional Rendering Concisely

```js
const App = () => {
  // ...
  const loginForm = () => (
      <form onSubmit={handleLogin}>

      </form>
  )

  const noteForm = () => (
      <form onSubmit={addNote}>

      </form>
  )

return (
  {user === null && loginForm()}
  {user !== null && noteForm()}
)
```

### Saving tokens to browser local storage

Local storage is a key-value database in the browser that can be used like:

```js
window.localStorage.setItem('name', 'daniel')
window.localStorage.getItem('daniel')
window.localStorage.removeItem('daniel')
```

These values are persisted when page is re-rendered (refreshed). Storage is origin-specific. (origin is protocol + hostname/domain + port of URL)

- When using objects, need to use `JSON.stringify(...)` and `JSON.parse(...)` because things are saved as strings.
- Setting is fairly easy... `handleLogin` changes:
  ```js
  window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
  ```
- Getting needs to be done with a `useEffect` hook. The empty array means it only happens when loading for the first time
  ```js
    useEffect(() => {
      const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        noteService.setToken(user.token)
      }
    }, [])
  ```
- Logout could be done by clearing the specific item from local storage:
  ```js
  window.localStorage.removeItem('loggedNoteappUser')
  ```
  Or emptying everything from localStorage:
  ```js
  window.localStorage.clear()
  ```

### Error handling with Axios - non-enumerable properties

In a `try...catch` block that uses axios, the caught error won't show all its properties if you use `JSON.stringify(...)`. Specifically, the response details. These properties aren't enumerable (=> won't show up in a `for...in` loop, or `Object.keys()` and `JSON.stringify()`).

To get around that, use `console.log(e)`, or `console.dir(e, { depth: null })`