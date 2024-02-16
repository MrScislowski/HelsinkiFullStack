# part 1

## Note to self on creating apps

NB: I'm using `pnpm`, so used

```bash
pnpm create vite@latest part1 -- template react
```

Then selected `React` for framework, and `Javascript` for variant in the interactive setup (I don't know why the setup was interactive since I passed in the react template...).

## Notes on a - Introduction to react

- react components are javascript functions that return JSX
- JSX returned by React components is compiled to Javascript by Babel (`create-react-app` and `vite` projects handle this automatically)
- the first letter of React components must be uppercase
- React will only render primitive values inside curly braces (or arrays of primitive values)

## Notes on b - Javascript

- Babel also transpiles new Javascript (e.g. ECMAScript 2023 aka ES14) into older code that all browsers will support.
- node.js is a Javascript runtime environment based on Google Chrome's V8 engine
- `let` and `const` ere introduced in ES6. Articles on when to use which:
  - [JavaScript Variables - Should You Use let, var or const? on Medium](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f)
  - [Keyword: var vs. let on JS Tips](http://www.jstips.co/en/javascript/keyword-var-vs-let/)
  - [var, let and const - ES6 JavaScript Features (youtube video)](https://youtu.be/sjyJBL5fkp8)
- Functional programming techniques are favored in React, so `concat` is preferred over `push` for arrays
- arrow functions were added in ES6
