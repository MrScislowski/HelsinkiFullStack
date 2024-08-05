## Creating New React Apps

How I create a new react app:

```bash
pnpm create vite courseinfo --template react
cd courseinfo
rm -r public/ src/assets src/App.css src/index.css .eslintrc.cjs
echo "" > README.md
```

## Creating new express apps

```bash
pnpm init
pnpm install express
pnpm install --save-dev nodemon
```

package.json:

```json
  "scripts": {
    "start": "node index.js",

    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
```




## Submitting Exercises

https://studies.cs.helsinki.fi/stats/courses/fullstackopen


Learning Promises well, [from You Don't Know JS](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md), keeps getting recommended

