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


### Cross-site scripting, XSS, and localstorage

#### XSS Overview

- a type of injection, where malicious scripts are injected into otherwise benign/trusted websites
- attacker uses web application to send malicious code (usually as browser side script) to different end user
- can occur anywhere a web app uses input from a user within the output it generates without validating or encoding it
- usually access cookies, session tokens, other sensitive info retained by the browser
- types of XSS
  - reflected (non-persisted, type I) XSS. User input is immediately returned by a web application in an error message / search result, without that data being made safe to render in the browser
  - stored (persistent, type II) XSS. User input is stored on the target server (e.g. in DB, log). User is able to retrieve the stored data from the web app without the data being made safe to render in the browser.
  - DOM-based (type 0) XSS. Attack payload is executed as a result of modifying DOM environment in victim browser used by original client side script, so that the code runs in an unexpected manner.

#### Preventing

Frameworks like React have good security practices. Whenever you're directly manipulating the DOM you have to be careful (e.g. React's `dangerouslySetInnerHTML` without sanitizing the HTML). If you do need to manipulate the DOM, Output Encoding and HTML Sanitization should be considered. OWASP will be producing framework-specific cheatsheets for React, Vue, and Angular according to [this website](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

### Conditional Rendering Using Styles

#### general idea:

```js
const hideWhenVisible = { display: loginVisible ? 'none' : '' }
const showWhenVisible = { display: loginVisible ? '' : 'none' }

<div style={hideWhenVisible}>
  // button
</div>

<div style={showWhenVisible}>
  // button
</div>
```

#### creating a `Togglable` component that can be used as a parent:

```js
const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
```

`props.children` refer to all child components of the `Togglable` component.
If a component is defined with no children, like `<Example prop1={value1} />`, `props.children` is an empty array.


### References and useRef

When a component wants to access the state of one of its parents, or an adjacent relative, the `ref` mechanism is an option. `Refs` are like state, in that they're data retained by React, but changing them doesn't trigger a re-render. Example use cases for `refs` are storing timeout IDs, storing and manipulating DOM elements, storing other objects that aren't necesary to calculate the JSX.

`App.jsx`:

```js
import {useRef} from 'react'

const App = () => {
  // ...
  const noteFormRef = useRef()

  const noteForm = () => {
    <Togglable buttonLabel='new note' ref={noteFormRef}>
    // ...
  }
  // ...
}
```

`Togglable.jsx`:
```js
import { forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, refs) => {
  // ...

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })
  // ...
})
```

- the function that creates the component is wrapped inside a `forwardRef` function call, so that the component can access the ref that is assigned to it
- the `useImperativeHandle` hook makes its `toggleVisiblity` function available outside the component

Now to use it,

```js
const App = () => {
  //
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    // ...
  }
}
```

This could have achieved this a bit more simply using "old React" class-based components, instead of hooks.

### PropTypes

Install package,

```sh
pnpm install prop-types
```

Using, on the `Togglable` component:
```js
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ...
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
```

On the `LoginForm` component:
```js
LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}
```

### Linting on frontend

Vite installs ESLint by default, so you just need to create a `.eslintrc.cjs` file. Suggested contents:

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    "indent": [
        "error",
        2
    ],
    "linebreak-style": [
        "error",
        "unix"
    ],
    "quotes": [
        "error",
        "single"
    ],
    "semi": [
        "error",
        "never"
    ],
    "eqeqeq": "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": [
        "error", "always"
    ],
    "arrow-spacing": [
        "error", { "before": true, "after": true }
    ],
    "no-console": 0,
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
    "no-unused-vars": 0
  },
}
```

And create a `.eslintignore` file in the repo root containing:

```
node_modules
dist
.eslintrc.cjs
vite.config.js
```

#### VSCode lint problems

If "Failed to load plugin react: Cannot find module 'eslint-plugin-react'" is showing, add this to `settings.json`: `"eslint.workingDirectories": [{ "mode": "auto" }]`

#### displayname problems

When creating a component with the `forwardRef` function, it may complain about not having a display name. You can just add this `displayName` attribute:

```js
const Togglable = React.forwardRef((props, ref) => {
  // ...
})

Togglable.displayName = 'Togglable'

```

### React Testing Environment

#### Installing

Packages to install:

- Vitest: replacement for jest
- jsdom: simulates a web browser
- react-testing-library: renders components for testing purposes
- jest-dom: extends expressive power of tests

```sh
pnpm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom
```

#### Configuring

Configure `package.json`:
```json
{
  "scripts": {
    // ...
    "test": "vitest run"
  }
  // ...
}
```

Configure `vite.config.js`:
```js
export default defineConfig({
  // ...
  test: {
    environment: 'jsdom',
    globals: true, // no need to import keywords like describe, test, expect
    setupFiles: './testSetup.js',
  }
})
```

and write `testSetup.js` (in project root) to reset the jsdom browser simulator

```js
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
```

To silence linting complaints,

```sh
pnpm install --save-dev eslint-plugin-vitest-globals
```

and edit `.eslintrc.cjs`:
```js
module.exports = {
  // ...
  env: {
    // ...
    "vitest-globals/env": true,
  },
  extends: [
    // ...
    'plugin:vitest-globals/recommended',
  ],
  // ...
}
```

#### Test Location

Two common conventions for test file location:

- in the same directory as the component being tested (used in the course as it's configured by default in vite/create-react-app)
- in a separate `test` directory

#### Selecting elements to test

It is not recommended that you use CSS attributes in the `container.querySelector(...)` method: CSS is meant to be for styling.

Instead the `screen.getBy*` methods. The order of preference is:

- `getByRole` e.g. `screen.getByRole('textbox', { name: /username/i })`, `screen.getByRole('button', { name: /sign in/i })`
- `getByLabelText` e.g. `screen.getByLabelText('password')`
- `getByPlaceholder`
- `getByText`
- `getByDisplayValue`
- `getByAltText`
- `getByTitle`
- `getByTestId` e.g. `screen.getByTestId('username')`, assuming the html has that attribute added; e.g. `<p data-testid="username"> {user.username} </p>

Aria role list [here](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#roles)

Nice table about whether elements are return / errors thrown / run asynchronously: [here](https://testing-library.com/docs/queries/about)


#### get vs find; whole vs part

`screen.getByText('example text')` looks for an exact match for content 'example text'... no more, no less. If we want to include content of which part of matches, we can do:

`screen.getByText('example text', { exact: false} )` or `await screen.findByText('example text')`.

#### render and testing example

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')


  expect(element).toBeDefined()
})
```
#### vitest expect .*

- [here](https://vitest.dev/api/expect.html) are the options of what expect can do
- `import { expect } from 'vitest'` will enable completion


#### debugging

If you ever want to see the HTML contained, you can do:

```js
screen.debug() // whole screen
screen.debug(element) // just for the element
```

#### clicking buttons

To make simulating user input a bit easier,

```sh
pnpm install --save-dev @testing-library/user-event
```

```js
import userEvent from '@testing-library/user-event'
// ...

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }


  const mockHandler = vi.fn() // vitest mock function https://vitest.dev/api/mock

  render(

    <Note note={note} toggleImportance={mockHandler} />
  )


  const user = userEvent.setup() // starts a session (an instance of userEvent)
  const button = screen.getByText('make not important')
  await user.click(button) // do the click

  expect(mockHandler.mock.calls).toHaveLength(1) // we expect the mock function to have been called once
})
```

Can also do typing, e.g.
```js
const input = screen.getByRole('textbox')
await user.type(input, 'some text...')
```

#### coverage

```sh
pnpm test -- --coverage
```
generates an HTML report in the `coverage` directory that will show which parts of your code are covered by tests.

### End-to-end testing

Possible tools for e2e testing:

- selenium
- headless browsers
- cypress
- playwright

#### cypress vs playwright

Cypress tests are run entirely within the browser (unlike most other libraries). Playwright tests are in a node process, connected to a browser via APIs. Playwright is backed by Microsoft, and has been gaining popularity quickly.


#### installing playwright

- create a new directory (not within the app project directory) to house end-to-end tests
- `npm init playwright@latest`
- edit `package.json` to contain:
  ```json
  {
    // ...
    "scripts": {
      "test": "playwright test",
      "test:report": "playwright show-report"
    },
    // ...
  }
  ```
- to run tests in gui, use `pnpm run test -- --ui`

#### setting up system prior to tests

- playwright assumes the system is up and running (it doesn't start the system itself)
- => you might want to have scripts for the frontend/backend to start in test mode, in their `package.json`:
  ```json
  "start:test": "NODE_ENV=test node index.js"
  ```


#### simple test

```js
const { test, expect } = require('@playwright/test')

describe('notes app' () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2023')).toBeVisible()
  })
})
```

#### which browsers to test

For speed reasons, you can restrict to just one browser engine:

```sh
pnpm test -- --project chromium
```

#### configuring quicker timeout, preventing parallel dataabbse accesses

Edit `playwright.config.js`:

```js
module.exports = defineConfig({
  timeout: 3000,
  fullyParallel: false,
  workers: 1,
  // ...
})
```

#### filling in forms using playwright

```js
test('login form can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByRole('textbox' { name: /username/i }).fill('mluukkai')
  await page.getByRole('textbox' { name: /password/i }).fill('salainen')
  await page.getByRole('button', { name: 'login' }).click()
  await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
```

#### set up and tear down code in common to all tests

```js
beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173')
})
```

#### common code within subtests (e.g. being logged in) - use describe blocks

```js
describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
  })
```

#### creating backend routes to assist testing, only when in test environment

- In the backend, create a `controllers/testing.js` file:
  ```js
  const router = require('express').Router()
  const Note = require('../models/note')
  const User = require('../models/user')

  router.post('/reset', async (request, response) => {
    await Note.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
  })

  module.exports = router
  ```
- Use it only when in testing mode. In `app.js`:
  ```js

  app.use('/api/login', loginRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/notes', notesRouter)

  if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
  }

  app.use(middleware.unknownEndpoint)
  app.use(middleware.errorHandler)

  module.exports = app
  ```

#### making requests to clear db before doing tests


```js
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened',  () => {
    // ...
  })
```

#### test for failing login, containing styling requirements etc

```js
test('login fails with wrong password', async ({ page }) =>{
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill('mluukkai')
  await page.getByTestId('password').fill('wrong')
  await page.getByRole('button', { name: 'login' }).click()

  const errorDiv = await page.locator('.error')
  await expect(errorDiv).toContainText('wrong credentials')
  await expect(errorDiv).toHaveCSS('border-style', 'solid')
  await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

  await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
})
```

#### running single tests

- Use `test.only` in Javascript test code, OR
- specify which test on command line:
  `pnpm test -- -g "login fails with wrong password"`

#### helper functions in tests

Since we'd have to login often, we could make a file `tests/helper.js` with:

```js
const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export { loginWith }
```

Then we can use the function in the test file like:

```js
const { loginWith } = require('./helper')

describe('Note app', () => {
  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

  test('a new note can be created', () => {
    // ...
  })

  // ...
})
```

#### Waiting for render

Using the `waitFor` method can be used to wait until a particular part has rendered

```js
const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()

  await page.getByText(content).waitFor()
}
```

#### Playwright authenticate once and stay logged in

Not covered in the course, but is described [here](https://playwright.dev/docs/auth)

#### Ports and proxies in the tests

Currently we have two URLs hardcoded: frontend address (`http://localhost:5173`), and backend address (`http://localhost:3001`). But because Vite has a proxy that routes all requests to the api route: `http://localhost:5173/api` , over to `http://localhost:3001`, we can use port 5173 for everything, and then make `http://locahost:5173` the baseUrl in `playwright.config.js`, like so:

```js
module.exports = defineConfig({
  // ...
  use: {
    baseURL: 'http://localhost:5173',
  },
  // ...
}
```

Now this longer version:

```js
await page.goto('http://localhost:5173')
await page.post('http://localhost:5173/api/tests/reset')
```

can be replaced with short version:

```js
await page.goto('/')
await page.post('/api/tests/reset')
```

#### Navigating DOM structure in testing and locating

Suppose we have this DOM structure:

```js
<li className='note'>
  <span>{note.content}</span>
  <button onClick={toggleImportance}>{label}</button>
</li>
```

And we try to change the importance of that note by doing something like:

```js
await page.getByText('first note').getByRole('button', { name: 'make not important' }).click()
```

That will break, because the `getByText` will get the `span` element, and the button isn't inside that. To get the parent element, you can do something like:

```js
const parentElement = await page.getByText('first note').locator('..')
```

The `locator` method accepts CSS or XPath selectors. (playwright recommends against the locator; it says using testIds is preferable if you can't use getRole etc)

#### Debugging tests in playwright

- Running the specified test in debug mode:

  ```sh
  pnpm test -- -g 'importance can be changed' --debug
  ```
- creating a breakpoint
  ```js
  await page.pause()
  ```
- running tests in UI mode:
  ```sh
  pnpm run test -- --ui
  ```
- running tests using the trace viewer (a visual trace is saved)
  ```sh
  pnpm run test -- --trace on
  npx playwright show-report # or using pnpm run test:report
  ```
- playwright ui and trace viewer can display element locators for you
- use playwright test generator which records the users interaction, then generates test code for you
  ```sh
  npx playwright codegen http://localhost:5173/
  ```
- playwright has a [vs code plugin](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

#### References

- [all documentation](https://playwright.dev/docs/intro)
  - [locators](https://playwright.dev/docs/locators)
  - [actions](https://playwright.dev/docs/input)
  - [assertions](https://playwright.dev/docs/test-assertions)
  - [API description](https://playwright.dev/docs/api/class-playwright)
    - [Page](https://playwright.dev/docs/api/class-page)
    - [Locator] (https://playwright.dev/docs/api/class-locator)
