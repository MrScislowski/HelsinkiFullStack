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

## Webpack

- is a bundler used by `create-react-app`
- others are now available (e.g. `esbuild`, which is used by vite)

### bundling

- older browsers don't know how to handle code that is divided into modules
- => source code is transformed into a single file that contains all application code (e.g. usinng `npm run build`)
- directory structure ends up looking like:
  ```
  ├── assets
  │   ├── index-d526a0c5.css
  │   ├── index-e92ae01e.js
  │   └── react-35ef61ed.svg
  ├── index.html
  └── vite.svg
  ```
- the bundled javascript file also contains the contents of all the imported packages (e.g. `redux` and `axios`)
- the index.html file simply loads that one `.js` file (this is preferred over loading multiple js files from html these days)

### transpiling

- jsx isn't recognized by browsers, so we have to transpile it into regular javascript
- `babel` is currently the most popular tool for this
- transpilation process executed by Babel is defined with plugins. The `@babel/preset-react` preset is a group of pre-configured plugins.
- `@babel/preset-env` transforms things into ES5 jsvascript (replaces all `const` with `var`, and uses `function`s, not arrow function)
- use a "loader" to recognize the js/jsx files and apply these transformations to them
- a css and style loader can be used to generate and inject a style element that contains all the styles of the application into the `main.js` file

### minifying

- UglifyJS is one of the leading tools for minification

### polyfill

- IE doesn't do promises. At all. So transpilation isn't enough. For that, you can use `polyfill`s

## Class Components

- prior to version 16.8 of react, it wasn't possible to define react components as Javascript functions if they used state
- state is stored in a single variable in class components (in contrast to multiple useState statements in hooks)
- `useEffect` is the right place to fetch data (executed when a component renders, or less frequently). In class components, the "lifecycle methods" offer corresponding functionality; `componentDidMount` is the appropriate place to fetch data.
- here's an example using classes instead of functions:
  ```js
  class App extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        anecdotes: [],
        current: 0
      }
    }

    componentDidMount = () => {
      axios.get('http://localhost:3001/anecdotes').then(response => {
        this.setState({ anecdotes: response.data })
      })
    }


    handleClick = () => {
      const current = Math.floor(
        Math.random() * this.state.anecdotes.length
      )
      this.setState({ current })
    }

    render() {
      if (this.state.anecdotes.length === 0 ) {
        return <div>no anecdotes...</div>
      }

      return (
        <div>
          <h1>anecdote of the day</h1>
          <div>{this.state.anecdotes[this.state.current].content}</div>

          <button onClick={this.handleClick}>next</button>
        </div>
      )
    }
  }
  ```

## MVC

- react is primarily a library for managing the creation of views in an application (i.e. `V` of `MVC`)
- angular is an all-encompassing frontend MVC framework. => React is called a library, not a framework
- when using redux, flux architecture is moreso being applied

## Security Practices

### keeping dependencies up-to-date

- Checking:
  ```sh
  pnpm outdated --depth 0
  ```
- updating:
  ```sh
  npm install -g npm-check-updates
  npm-check-updates
  ncu -u
  pnpm install
  ```

### checking for security issues in dependencies

```sh
pnpm audit
pnpm audit --fix
```

(If major version number has increased, audit won't update these by default [doing so could cause the application to stop working])

### misc security practices the course casually mentioned

- [article about express security](https://expressjs.com/en/advanced/best-practice-security.html)
- use `Helmet` library in backend
- use eslint `security-plugin`

## Misc Topics

### Progressive web apps (PWA)

- apps that work on every platform, and in offline mode

### microservice architecture

- backend is split into separate services that communicate over network
- often an "API gateway" is used so the frontend views the backend like a monolith, even if it's not

### serverless

- AWS lambda, Google cloud functions, Azure functions allow you to run code without knowing anything about the server / routing etc
- the smallest executable unit is a function, instead of a node process

### recommended libraries

use case | library
---|---
complicated data | lodash
desire for functional programming | ramda
handling dates and times | date-fns
complex forms | React Hook Form
displaying graphs | recharts and highcharts
gathering analytics data | React Google Analytics 4
community of react developers on discord | reactiflux

## My Experience Styling

### Tailwind

#### set up (project)

- I'm following [this guide](https://tailwindcss.com/docs/guides/vite)
- Install, and initialize `tailwind.config.js` and `postcss.config.js` files
  ```sh
  pnpm install --save-dev tailwindcss postcss autoprefixer
  pnpm dlx tailwindcss init -p # I'm substituting 'pnpm dlx' for 'npx' as recommended by ChatGPT
  ```
- Edit `tailwind.config.js` to include
  ```js
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  ```
- Create or restore the CSS file in `src/index.css`, and then add `import './index.css'` to the `main.jsx` file
- Add these lines to the `index.css` file:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

#### set up (editor)

- Install [VSCode extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- Set up prettier to use the tailwind class sorter
  - install
    ```sh
    pnpm install --save-dev prettier prettier-plugin-tailwindcss
    ```
  - configure to use
    ```json
    // .prettierrc
    {
      "plugins": ["prettier-plugin-tailwindcss"]
    }
    ```