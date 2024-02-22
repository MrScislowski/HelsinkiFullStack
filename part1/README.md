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
- `this` keyword functions differently in functions defined by arrow syntax, and functions defined with `function` keyword

  ```javascript
  const person = {
    name: "Ann Example",
    greet: function () {
      console.log("hello, my name is " + this.name);
    },
  };

  const greetFunction = person.greet;
  greetFunction(); // does not work, because "this" object is no longer bound to the person object
  ```

  - when calling a method through a reference, method loses knowledge of what original `this` was; `this` when using a reference becomes the global object
  - in this course, `this`-less javascript is used. Here's a fix to a common problem:

  ```javascript
  setTimeout(person.greet, 1000); // wrong
  setTimeout(person.greet.bind(person), 1000);
  ```

  - arrow functions solve some `this` problems. But they shouldn't be used for defining methods of objects, because `this` won't work at all.
  - to learn more: [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth)

- `class` keyword was added in ES6:

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  greet() {
    console.log("hello, my name is " + this.name);
  }
}

const adam = new Person("Adam Ondra", 29);
adam.greet();

const janja = new Person("Janja Garnbret", 23);
janja.greet();
```

- these objects act like if they were defined in Java. But Javascript recognizes them both as just `Object` types, because the only types in javascript are: Boolean, Null, Undefined, Number, String, Symbol, BigInt, and Object.
- addition in types in ES6 was controversial
- some resources recommended for Javascript:
  - [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS)

## Notes on cd- Component state, event handlers

### mutating state

It is forbidden in React to mutate state directly... always set state to a new object.

```javascript
const [items, setItems] = useState([1, 2, 3, 4, 5]);

// BAD
items.push(6);
const newItems = items;
setItems(newItems);

// GOOD
const newItems = [...items, 6];
// OR
const newItems = items.concat(6);

setItems(newItems);
```

## Notes on d - A more complex state, debugging React apps

### Update of the state is asynchronous

```javascript
const Component = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [total, setTotal] = useState(0);

  return (
    <>
      <p>Total is: {total}</p>
      <button
        onClick={() => {
          console.log(`a = ${a}`);
          setA(a + 1);
          console.log(`a = ${a}`);
          setTotal(a + b);
        }}
      >
        Increase a by 1
      </button>
    </>
  );
};
```

This doesn't work, because the value of `a` hadn't updated by the time setTotal was called. State updates asynchronously (at some point before the component is rendered again). Each render's state values are fixed.

So in fact, this button only increases the value by 1:

```javascript
import { useState } from "react";

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 1);
          setNumber(number + 1);
          setNumber(number + 1);
        }}
      >
        +3
      </button>
    </>
  );
}
```

React waits until all code in event handlers run before processing state updates. It "batches" things, so it can update multiple state variables without running too many re-renders.

If you want to update the same state variable multiple times before the next re-render, instead of passing the next state value, you can pass a function that calculates the new state based on the previous one. (This is called an _updater function_). All updates get queued and run in order:

```javascript
setNumber((n) => n + 1);
```

### State in React

Since 16.8.0, the `useState` hook was available. Before that, state had to be embedded in class components, using Javascript class syntax.

### console.log-ing objects

```javascript
// java-like fashion doesn't work well:
console.log("props value is " + props); // "props value is [object Object]"
// use this instead
console.log("props value is ", props); // "props value is [object Object]"
```

### `debugger` statement

You can write `debugger;` on any line in javascript. It will pause execution there, and you can inspect variable values in the console.

### never assign components inside other components

(because then React can't optimize renders)
