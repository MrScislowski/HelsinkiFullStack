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

https://fullstackopen.com/en/part3/node_js_and_express#postman
