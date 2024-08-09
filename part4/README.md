## Project structure

```
├── index.js
├── app.js
├── dist
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
```

### Logging module

`utils/logger.js`: (if we wanted to start writing logs to a file / external logging service, we'd only have to make changes to this file)

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

### Environment variable (config) module:

`utils/config.js`: 

```js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
```

### separate app & server files

`index.js`
```js
const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

### separate route handlers

Event handlers of routes are often called "controllers".

=> move to `notes.js` file with following changes:

```js
// first line is
const notesRouter = require('express').Router()

// all routes can be shortened; remove /api/notes

// last line is
module.exports = notesRouter
```
This router is a middleware, so in the `app.js` file, use it like:

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

### custom middleware

`utils/middleware.js` module:

```js
const requestLogger = (req, res, next) => { /*...*/ }
const unknownEndpoint = (req, res) => { /* ... */ }
const errorHandler = (error, req, res, next) => { /* ... */ }

module.exports = {
  requestLogger, unknownEndpoint, errorHandler
}
```

### making connection to DB

`app.js` is responsible for this.

## Note on exports

`single.js`: 

```js
module.exports = f1
```

`multiple.js`:

```js
module.exports = {f2, f3}
```

`usage.js`:

```js
// only option
const f1 = require('single')

// multiple options
const { f2, f3 } = require('multiple')

const lib = require('multiple')
// now use lib.f2(), lib.f3()
```

## Testing

### Test Libraries

`Mocha` was the original popular runner for JavaScript. A few years ago, `Jest` became the new standard. `Vitest` is a newcomer.

But node also comes with a built-in library, `node:test`

### Setting up `node:test`

- `package.json`:

  ```json
  "scripts": {
    // ...
    "test": "node --test"
  }
  ```

- `mkdir tests`

- Now suppose you're testing a utility called "reverse"... make a file `tests/reverse.test.js`:
  ```js
  const { test, describe } = require('node:test')
  const assert = require('node:assert')

  const reverse = require('../utils/for_testing').reverse

  describe('reverse', () => {
    test('reverse of a', () => {
      const result = reverse('a')
      assert.strictEqual(result, 'a')
    })

    test('reverse of react', () => {
      const result = reverse('react')
      assert.strictEqual(result, 'tcaer')
    })
  })
  ```

### Testing backend

#### Mocking database

Not done in this course b/c the backend is pretty simple, but if you needed to mock the db, you could use something like [this](https://github.com/nodkz/mongodb-memory-server)

#### Test environment (NODE_ENV)

To set NODE_ENV on multiple operating systems:

```sh
pnpm install cross-env
```

Then edit `package.json`:

```json
 "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "test": "cross-env  NODE_ENV=test node --test",
 }
```

#### Using different DB in test/development mode...

`utils/config.js`

```js
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
```

and `.env`
```
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001

TEST_MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/testNoteApp?retryWrites=true&w=majority
```

When I run `mongosh` I get something like:
`mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.12`

#### testing the API using `supertest`

Install

```
pnpm install --save-dev supertest
```

Use (note that we're only using `app.js`, not `index.js`: supertest deals w/ listening on ports etc)
```js
const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, 2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})

after(async () => {
  await mongoose.connection.close()
})
```

##### ommitting logging when using tests:
`utils/logger.js`
```js
const info = (...params) => {

  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
}

const error = (...params) => {

  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
}

module.exports = {
  info, error
}
```


