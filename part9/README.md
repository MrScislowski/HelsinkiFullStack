# TypeScript

## Overview

- Typescript = open-source typed superset of Javascript that compiles to plain Javascript. Developed by Microsoft

- Typescript consists of 3 parts:
  - Language: syntax, keywords, type annotations
  - Compiler: does type information erasure and code transformation, so that TS can be transpiled to JS. TS isn't genuine statically typed code b/c type information is removed at compile time
  - Language service: collects type information from the source code. Development tools can use this for providing intellisense, type hints, refactoring

- TS inherits all the reserved keywords from JS, but adds some of its own, like `interface`, `type`, `enum`

- [DefinitelyTyped Github page](https://github.com/DefinitelyTyped/DefinitelyTyped) contains type declaration files

- Recommended assistance if default typing from TS isn't working for you:
  - [type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
  - [type guarding / narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

- In a production environment, you often have a "build step", where code is transpiled into a separate folder, and run from there

- In a development environment, usually you real-time compile and auto-reload

## Set-up

- Install packages. `ts-node` compiles and executes a TS file, so there's no need for a separate compiling step:

  ```sh
  pnpm install --save-dev ts-node typescript
  ```

- Set up `package.json`:
  ```json
  {
    // ...
    "scripts": {
      "ts-node": "ts-node"
    }
    // ...
  }
  ```

  NB: command line options need to follow a "--" when using this from the command line. For example

  ```sh
  pnpm run ts-node file.ts -- -s --someoption
  ```

- set up minimal `tsconfig.json` configuration (this allows us to omit types for some variables if we feel like it):
```json
{
  "compilerOptions": {
    "noImplicitAny": false
  }
}
```

## Defining your own types

This defines `Operation` to be essentially an "enum" of strings:

```ts
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation) : number => {
  switch(op) {
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) throw new Error('Can\'t divide by 0!');
      return a / b;
    case 'add':
      return a + b;
    default:
      throw new Error('Operation is not multiply, add or divide!');
  }
}
```

## Type narrowing

The default type of a catch block parameter is `unknown`. This is a type-safe counterpart of `any`.

The `instanceof` type guard is narrowing error so that we can access the `.message` property

```ts
try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
```

## Installing types files / definitions

- Using Definitely Typed project:

  ```sh
  pnpm install --save-dev @types/react @types/express @types/lodash @types/jest @types/mongoose
  ```

- Sometimes an npm package also includes its types within the code and in that case, you don't need the `@types/...` package

- `ts-node` has defined `@types/node` as a dependency


## Validating Data From, e.g., Command Line

```ts
interface MultiplyValues {
  value1: number;
  value2: number
}

const parseArguments = (args: string[]) : MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args(3))) ) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    }
  } else {
    throw new Error('Provided values were not numbers!')
  }
}

const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText, a * b);
}

try {
  const {value1, value2} = parseArguments(process.argv);
  multiplicator(value1, value2, `Multplied ${value1} and ${value2}, the result is:`);
} catch (error: unknown) {
  let message = "Something bad happened"
  if (error typeof Error) {
    message += error.message
  }
  console.log(message)
}
```

## Array syntax

Both of these are valid:

```ts
let values: number[];
let values: Array<number>;
```

There's an Eslint rule called "array-simple", that states you use the `[]` syntax for simple arrays, and the generics syntax for more complex ones.

## A more complete tsconfig

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    "noImplicitAny": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

## `import` vs `require`

The following:
```js
const express = require('express')
```

Doesn't provide as good typing as this:
```js
import express from 'express'
```

Which import statement to use depends on the export method used in the package.

### Module Deep-dive

#### ESM export

- Can have multiple named exports, but just one default export
- named exports (are imported by same name, but can be renamed using `as`):
  - `export { myFunction2, myVariable2 };`
  - `export { myFunction2 as fn2, myVariable as v2}`
  - `export const myVariable = Math.sqrt(2);`
- default exports (can be imported by any name):
  - `export default myFunction;`
  - `export default Math.sqrt(2)`

#### CJS export

- named export equivalent:
  - `exports.myFunction2 = //...`
  - `exports.myVariable2 = //...`
- default exports:
  - `module.exports = //...`
- However, unlike in ESM, if you want a default export AND named exports, your only option is to put the properties directly onto the default export
  ```js
  // Default export
  const defaultExport = (a, b) => a + b;

  // Named exports
  const subtract = (a, b) => a - b;
  const multiply = (a, b) => a * b;

  // Attach named exports as properties of the default export
  defaultExport.subtract = subtract;
  defaultExport.multiply = multiply;

  // Export the default function with named exports as properties
  module.exports = defaultExport;

  // app.js (CommonJS)
  const math = require('./math');

  console.log(math(4, 2)); // 6 (default export)
  console.log(math.subtract(4, 2)); // 2 (named export)
  console.log(math.multiply(4, 2)); // 8 (named export)
  ```

#### Interoperability

Putting this in your `tsconfig.json` allows you to use import using `import` even if the modules use CommonJS

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## `ts-node-dev` is equivalent to `nodemon`

Install

```sh
npm install --save-dev ts-node-dev
```

use in package.json

```json
{
  // ...
  "scripts": {
      // ...

      "dev": "ts-node-dev index.ts",
  },
  // ...
}
```

## `unknown` and `any`

`unknown` means "I don't know". `any` means "I don't care"

### disabling implicit any

In `tsconfig.json`, the line `"noImplicitAny": true,`.

### disabling explicit any

Use ESlint for this. Install...

```sh
pnpm install --save-dev eslint @eslint/js @types/eslint__js typescript typescript-eslint
```

Configure `eslint.config.mjs`
```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
});
```

Create a linting rule in `package.json`

```json
"lint": "eslint ."
```

### Other linting addons

Install

```sh
pnpm install --save-dev @stylistic/eslint-plugin
```

Amend `eslint.config.mjs`:

```js
// ...
plugins: {
  "@stylistic": stylistic,
},
 rules: {
    '@stylistic/semi': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { 'argsIgnorePattern': '^_' }
    ],
  },
```

### Type assertion - dirty trick for types

Suppose `calculator` function took two `number` types, and an `Operation` type. You can silence an eslint rule like:

```js
const {v1, v2, op} = req.body;

const result = calculator(Number(v1), Number(v2), op as Operation)
```