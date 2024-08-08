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
