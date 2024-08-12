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

##### clearing out the db before each test...

```js
const { beforeEach } = require('node:test')
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})

```

##### running only some tests

- `test.only` instead of `test` in the testing file, and `node --test --test-only` from the command line
  ```js
  test.only('...')
  ```
- specify test files:
  ```
  node test -- tests/note_api.test.js
  ```

#### random notes on promises and async/await

- promises:
  ```js
  Note.find({})
  .then(notes => {
    return notes[0].deleteOne()
  })
  .then(response => {
    console.log('the first note is removed')
    // more code here
  })
  ```
- await:
  ```js
  const notes = await Note.find({})
  const response = await notes[0].deleteOne()

  console.log('the first note is removed')
  ```

Important details when using async/await:

- to use `await` w/ async operations, they have to return a promise
- using await is only possible inside of an async function; so you sometimes wind up wrapping things like this:
    ```js
    const main = async () => {
      const notes = await Note.find({})
      const response = await notes[0].deleteOne()

      console.log('the first note is removed')
    }
    main()
  ```


#### eliminating try-catch

Install the library:

```sh
npm install express-async-errors
```

Introduce library in `app.js` before any routes are imported
```js
require('express-async-errors')
```

If an exception occurs in an async route, the execution is automatically passed to the error handling middleware.

#### async/await in foreach

This code is problematic, because the forEach moves on before the notes are actually save:
```js
beforeEach(async () => {
  await Note.deleteMany({})
  console.log('cleared')

  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')
  // ...
})
```

The solution is to use `Promise.all`:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

If the promises need to be executed in a particular order, using a `for...of` block can guarantee this.

####  MongoDB and joins / aggregations

Traditionally document databases don't support join queries used to aggregate data from multiple tables. Version >= 3.2 of Mongo added $lookup aggregation queries (not used in this course). Functionality similar to join queries usually by making multiple queries to the database. Mongoose sometimes *looks* like it's joining/aggregating data, but it's actually making multiple queries to the database in the background.

#### Document vs Relational Databases

Chosen schema must support the use cases of the application; this is not a simple design decision. Schema-less dbs require developers to make more radical design decisions about data organization at the beginning of the project than relationship dbs with schemas do. Often, relational databases offer a roughly suitable way of organizing data.

#### references (like foreign keys) in mongoose

The `ref` field is for mongoose; Mongo does not really know what the field references. This design is in contrast to relational db conventions because references are stored in both documents

```js
const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```

#### Passwords and hashes

`bcrypt` generates password hashes. Use it. It's way more secure than other hashing algorithms.

Installing:

```sh
pnpm install bcrypt
```

Using:

```js
const saltRounds = 10 // higher numbers take longer to generate
const passwordHash = await bcrypt.hash(password, saltRounds)
```

#### Avoiding duplicates (uniqueness) in mongo / mongoose

MongoDB can ensure uniqueness of single fields or compound ones using [uniqueness index](https://www.mongodb.com/docs/manual/core/index-unique/). In mongoose:

```js
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // this ensures the uniqueness of username
  },
  //...
})
```

This only works if the database is in a healthy state (there aren't already duplicates)

#### populate in mongoose is like join in sql

mongoose does multiple queries. In sql, join queries are "transactional", which means the state of the database doesn't change during the time the query is made. Nothing guarantees this in mongoose.

Basic usage:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes')

  response.json(users)
})
```

Selecting only some fields:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 })

  response.json(users)
})
```

## Authentication

### Token-based authentication

#### how it works

Sequence of events:

- user logs in using a login form in react
- react code sends username & password to backend as POST request
- if un/pw are correct, server generates a "digitally signed" token that identifies the logged-in user, and responds to the POST request with this info
- the browser saves the token (e.g. to the state of a react application)
- when the user does an operation requiring identification, the react code sends the token to the server with the request
- the server uses the token to identify the user

#### code for use

install:

```sh
pnpm install jsonwebtoken
```

Use:

```js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
```

#### browser sending token to server

Using the "Authorization" header is just one of several ways. We use the `Bearer` scheme, which means if the token is `eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW`, the Authorization header will be: `Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW`

```js
const jwt = require('jsonwebtoken')

// ...
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
```

#### JWT validation middleware / prepackaged solutions

If application has multiple interfaces, putting validation in its own middleware makes sense. An existing library like `express-jwt` could also be used.


#### Security issues

If token gets in wrong hands, there's blind trust, which is a problem. Two solutions

#### simple: limit validity period of token

(Once it's expired, client app needs to get new token, usually by logging in again)

Code:

```js
  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
```


#### complicated: sever-side session

(save info about each token to the backend db, and check for each API request if access rights corresponding to the tokens are still valid). Access rights can be revoked at any time in this scheme.

This makes the backend more complex, and more database calls are required (db access much slower than checking validity of token). To speed this up, often a "key-value" db is used fo r this (e.g. Redis).

In this scheme, the token is often just a random string (that doesn't include any info about the user). For each API request, the server fetches the relevant info about the identity of the user from the db. Also, it's common that instead of using "Authorization" headers, cookies are used to transfer the token between client and server.

#### HTTPS

Whenever usernames / passwords / token authentication is used, need to use HTTPS. Node has https servers (but they require more configuration). Often PaaS will route all traffic between browser and servers through HTTPS.