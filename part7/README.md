## Routing

### navigation bar

- in old school webpages, navigating to a different view would cause a GET request
- in SPA, this doesn't happen; the javascript just renders different info

### self-made routing

Here's a super simple self-made routing implementation:

```js
import { useState }  from 'react'
import ReactDOM from 'react-dom/client'

const Home = () => (
  <div> <h2>TKTL notes app</h2> </div>
)

const Notes = () => (
  <div> <h2>Notes</h2> </div>
)

const Users = () => (
  <div> <h2>Users</h2> </div>
)

const App = () => {
  const [page, setPage] = useState('home')

  const toPage = (page) => (event) => {
    event.preventDefault()
    setPage(page)
  }

  const content = () => {
    if (page === 'home') {
      return <Home />
    } else if (page === 'notes') {
      return <Notes />
    } else if (page === 'users') {
      return <Users />
    }
  }
  return (
    <div>
      <div>
        <a href="" onClick={toPage('home')}>
          home
        </a>
        <a href="" onClick={toPage('notes')}>
          notes
        </a>
        <a href="" onClick={toPage('users')}>
          users
        </a>
      </div>

      {content()}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Problems with this:
- the address bar doesn't change, so these different views aren't bookmark-able
- the "back" button doesn't work properly

### react-router

```sh
pnpm install react-router-dom
```

#### Simple Example

```js
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

const App = () => {

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
      </div>

      <Routes>
        <Route path="/notes" element={<Notes />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <div>
        <i>Note app, Department of Computer Science 2024</i>
      </div>
    </Router>
  )
}
```

- `BrowserRouter` is a router that uses the HTML5 history API (i.e. doesn't by default load a new page if the url is changed)
- `Route` tags perform conditional rendering based on the browser address
- `Routes` works by rendering the first component whose path matches the browser address bar url

#### parameterized routes (sending non-filtered info)

In the router:

```js
<Routes>
  <Route path="/notes/:id" element={<Note notes={notes} />} />
  // ...
```

In the `Note` element:

```js
import { useParams } from 'react-router-dom'
// ...

const Note = (props) => {
  const id = useParams().id
  // ...
}
```

#### onNavigate

Allows you to programatically change the url of the browser. For example:

```js
import { useNavigate } from 'react-router-dom'
// ...

const Login = (props) => {
  const navigate = useNavigate()

  const handleLogin = (event) => {
    // ...
    navigate('/')
  }
}
```

#### redirect using <Navigate />

```js
<Routes>
  // ...
  <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
```

#### more precise parameterized routes (sending filtered info) using `useMatch`

- You can't use `useMatch` in the same component as the `Router` tags (so move the `Router` tags up to `index` or something)
- whenever the browser url changes, `useMatch` is run to give a match object:
  ```js
  import { useMatch } from 'react-router-dom'
  // ...
  const App = () => {
    // ...
    const match = useMatch('/notes/:id')
    const note = match
      ? notes.find(note => note.id === Number(match.params.id))
      : null
    // ...
    return (<>
      <Routes>
        <Route path='/notes/:id' element={<Note note={note} />} />
        // ...
      </>)
  }

  ```

## Hooks

### About

  Hooks:
  - function names always start with `use`
  - cannot be called inside loops/conditions/nested functions
  - should ony be called:
    - at the top level in the body of a function component
    - at the top level in the body of a custom hook

### Writing custom hooks

#### counter hook

Defining the hook:
```js
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value,
    increase,
    decrease,
    zero
  }
}
```

Using the hook
```js
const App = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>
    {left.value} <button onClick={left.increase}> left </button>
    {right.value} <button onClick={right.increase}> right </button>
    </div>
  )
}
```

#### field (for forms) hook

Defining:

```js
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return { type, value, onChange }
}
```

Using:

```js
const App = () => {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  return (
    <div>
      <form>
        name:
        <input  {...name} />
        <br/>
        birthdate:
        <input {...born} />
        <br />
        height:
        <input {...height} />
      </form>
      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  )
}
```

## Styling

### Covered in the text:

Bootstrap:

```sh
pnpm install react-bootstrap
```

MaterialUI:

```sh
pnpm install @mui/material @emotion/react @emotion/styled
```

### Reddit recommendations

#### Component libraries

- chakra-ui

#### Styling library

- tailwindcss