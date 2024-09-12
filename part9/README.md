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