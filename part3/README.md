## Info about node

`NodeJS` is a Javascript runtime based on Google Chrome's V8 JavaScript engine.

Browsers don't support the newest versions of JavaScript, which is why they must be transpiled, e.g. by Babel. But the backend is easily up-to-date

## Creating a new node project

I'm going to use

```shell
pnpm init
```

## Modules

ES6 modules (favored in code that runs in browser)

```javascript
import http from "http";
```

CommonJS modules; use this because node's support for ES6 modules isn't perfect yet:

```javascript
const http = require("http");
```

## Express (nicer than using `http`)

`pnpm install express` for your project.

### Dependencies & versions

This is semantic versioning:

```json
"express": "^4.18.2"
```

The version 4.18.2 stands for `major.minor.patch`. The caret means that this project has to have express version 4, at least minor version 18, and at least patch number 2

`^` means greater than or equal

### Updating Dependencies

```shell
pnpm update
```

## Nodemon

Installing nodemon:

```shell
npm install --save-dev nodemon
```

Manually starting it:

```shell
node_modules/.bin/nodemon index.js
```

Starting it in `package.json`:

```json
{
  // ..
  "scripts": {
    "start": "node index.js",

    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
  // ..
}
```

so you can run it with `npm run dev`. (Need `run` because it is a pre-defined script command, unlike `start` and `test`)

## REST

stands for REpresentational State Transfer. Technically there are quite strict rules that define what a RESTful interface is, and most so-called REST APIs online don't conform to this. Technically we're making a looser "resource-oriented architecture".

## Express route parameters

```javascript
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  //
});
```

## 404 message improvement

If you want your backend api to provide more information than just "404", you can do:

```javascript
function(req, res) {
    res.statusMessage = "Current password does not match";
    res.status(400).end();
}
```

## Rest clients:

- curl
- postman (desktop app, or run in vscode)
- VSCode REST Client by huachao mao
- IntelliJ Webstorm - create a file with extension .rest

## Parsing JSON in express

Registering the built-in middleware function parses the request body, and attaches it to `req.body`:

```js
app.use(express.json());
```

## HTTP GET & HEAD should be safe

GET and HEAD methods should not cause any side effects on the server (e.g. change the state of the DB).

## HTTP requests (except POST) should be idempotent

(running them more than once is the same as running them once)

## middleware

Receives 3 parameters, and calls `next` at the end of the function body to yield control to the next middleware

e.g:

```js
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
```

We use it at the top of the routing file like:

```js
app.use(requestLogger);
```

After our routes, we could define a middleware to catch all unknown routes

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
```

## Same Origin Policy & CORS

Consider this url: `http://example.com:80/index.html`

It has a protocol (aka scheme) of "http".
The host is "example.com".
The port is 80.

You visit example.com, and the response is an HTML file with references to external assets/resources. If their URLs have the same scheme+host+port, the browser processes the response without any issues.

If the scheme+host+port isn't the same, the browser will check the `Access-Control-Allow-origin` response header. If it contains "\*" on the URL of the source HTML, it will process the response. Otherwise it will throw an error.

This is a security mechanism called `same-origin policy` that is implemented by browsers.

CORS makes this flexible:

```
Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.
```

Since our backend is running on `http://localhost:3001` and our frontend on `http://localhost:5173`, they do not have the same origin.

We can allow requests from other origins by using Node's `cors` middleware

```
pnpm install cors
```

```
const cors = require("cors")
app.use(cors())
```

## Hosting on Fly.io

On backend index.js change to:

```js
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Follow [installation instructions](https://fly.io/docs/flyctl/install/) that required:

```powershell
powershell.exe -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

Then I signed up for an account.

Then

```powershell
fly auth login
```

Initializing the app using:

```
fly launch --no-deploy
```

Causes a fly.toml file, Dockerfile and .dockerignore to be created.

Then

```
fly deploy
```

To check the number of allocated machines, did

```
fly scale show
```

Then to insist I only want to use one machine:

```
fly scale count 1
```

And now `https://phonebook-silent-mountain-480.fly.dev/` is working!

Also, I deployed it on render: `https://helsinkifullstack.onrender.com/`

## Hosting frontend from within backend

`npm run build` creates a production build, which creates a `dist` directory containing `index.html`, and a minified javascript file. You can then copy this `dist` directory into the backend repo, then tell express to show that static content:

```
app.use(express.static('dist'))
```

## Scripts to rebuild frontend & re-host

For fly

```json
{
  "scripts": {
    // ...
    "build:ui": "rm -rf dist && cd ../notes-frontend/ && npm run build && cp -r dist ../notes-backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs"
  }
}
```

For render:

```json
{
  "scripts": {
    //...
    "build:ui": "rm -rf dist && cd ../frontend && npm run build && cp -r dist ../backend",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push"
  }
}
```

(I'll prefix all these unix commands with `shx` so they work on windows or unix)

## Proxies in vite config

If frontend is deployed in `dist` within backend distribution, you can use relative URLs to fetch backend data from the frontend. But when developing locally, this will cause URL errors (as the two services run on different ports). To fix this, you can add a proxy in the frontend `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
```

## MongoDB

### connecting

```
The reason for using Mongo as the database is its lower complexity compared to a relational database. Part 13 of the course shows how to build Node.js backends that use a relational database.
```

This is my atlas connection string:

`mongodb+srv://danieljscislowski:<password>@cluster0.chxji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

This connection string will put it in the database called "helsinkifullstackPhonebook":

`mongodb+srv://danieljscislowski:${password}@cluster0.chxji.mongodb.net/helsinkifullstackPhonebook?retryWrites=true&w=majority&appName=Cluster0`

### schema w/ Mongoose

```js
// create schema
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// create model
const Note = mongoose.model("Note", noteSchema);

// create instance
const note = new Note({
  content: "HTML is Easy",
  important: false,
});

// save to database
note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});
```

## Authentication using env

```
pnpm install dotenv
```

`.env` file:

```
MONGODB_URI="mongodb+srv://fullstack:password@db.gwcmebp.mongodb.net/?retryWrites=true&w=majority&appName=db"
```

`.gitignore` file:

```
.env
```

any `.js` file that you want to use the environment variable:

```js
require("dotenv").config();
const url = process.env.MONGODB_URI;
```

## env authentication on fly.io

- make sure `.env` is listed in the `.dockerignore`
- run
  ```sh
  fly secrets set
  MONGODB_URI="momongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority"
  ```

## have mongoose ignore the \_\_v and rename \_id to id:

```js
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
```

## error handling middleware

Error handlers in express take 4 arguments instead of 3: `(error, req, res, next)`. Whenever `next` is called with one argument instead of none, the error handler is called instead of the other middlewares.

Defining error handling middleware:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);
```

Using error handling middleware:

```js
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
```

## middleware order

- `app.use(express.json())` should be first, so that `req.body` is available
- the `unknownEndpoint` handler should come after all the route definitions (express handles each middleware in the order it's defined, so if you define middleware after the error one, it won't be able to throw errors to the error handler)
- the error handling middleware has to be the _last_ defined middleware
