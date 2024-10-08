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

## tsc

Whenever typescript is installed, you can use `tsc`

- `package.json`

  ```json
  // ...
  "scripts": {
    "tsc": "tsc",
    "start": "node build/index.js"
    // ...
  },
  ```

- Initialize `tsconfig.json` by doing: (NB: options before the `--` go to pnpm, after go to the script, `tsc`). Actually, on windows `pnpm run tsc --init` works better...

  ```sh
  pnpm run tsc -- --init
  ```

- Example of `tsconfig.json` to keep:

  ```json
  {
    "compilerOptions": {
      "target": "ES6", // ECMAScript version used to generate JS; ES6 supported by most browsers
      "outDir": "./build/", // compiled code goes here
      "module": "commonjs", // use `require` syntax instead of `import`. `import` not supported in older versions of node
      "strict": true, // shorthand for noImplicitAny, strictNullChecks, and a bunch of other stuff
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noImplicitReturns": true,
      "noFallthroughCasesInSwitch": true,
      "esModuleInterop": true // interoperability between CommonJS and ES Modules
    }
  }
  ```

  - Add `ignores: ["build/*"],` to `eslint.config.mjs` so the compiled code isn't linted


## Project structure

- They're defining routes in `src/routes/diaries.ts` instead of `src/controllers/...`
- `src/services` will be modules do the data manipulation ("business logic"). The naming was made popular by the Java Spring framework
- Need to put `"resolveJsonModule": true` in `tsconfig.json` to import json files as javascript objects. Thing is, you'd have to use a type assertion if you wanted it typed.
- Don't have two identical filenames with different file type/extensions in the same directory b/c imports will be unpredictable


## Utility Types

Defines types from existing types, for example:

- `Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>[]`
- `Omit<DiaryEntry, 'comment'>[]`

## Types of request & response

`res` by default has type:
```ts
Response<any, Record<string, any>, number>
//       ^ body
```

If you want to make it more descriptive, you could do:
```ts
router.get('/', (_req, res: Response<DiaryEntry[]>) => {/* ... */})
```

## Type Guards

- This is a parsing function, not a type guard:
  ```ts
  const parseComment = (comment: unknown): string => {
    if (!comment || !isString(comment)) {
      throw new Error('Incorrect or missing comment');
    }

    return comment;
  };
  ```

- This is the type guard:
  ```ts
  const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
  };
  ```
  - The reason it has to use `typeof` and `instanceof` is because `typeof` works if you create a string using the primitive constructor. But if you create a string using the object constructor `s = new String('hi')`, you have to use `instanceof`.

### Enums with type guards

- Define enum:
  ```ts
  export enum Weather {
    Sunny = 'sunny',
    Rainy = 'rainy',
    Cloudy = 'cloudy',
    Stormy = 'stormy',
    Windy = 'windy',
  }
  ```
- use it in type guard:
  ```ts
  const isWeather = (param: string): param is Weather => {
    return Object.values(Weather).map(v => v.toString()).includes(param);
  };
  ```
- (may have to use parseWeather now )

### Check to see all properties exist

I don't love the `if( /* ... && ... && ... */ )` line, but apparently it's necessary for now...
```ts
const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object && 'date' in object && 'weather' in object && 'visibility' in object)  {
    const newEntry: NewDiaryEntry = {
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
      date: parseDate(object.date),
      comment: parseComment(object.comment)
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};
```

## Schema Validation Libraries

- Zod works well with typescript
- `pnpm install zod`
- This code:
  ```ts
  const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
  };

  const parseComment = (comment: unknown): string => {
    if (!isString(comment)) {
      throw new Error('Incorrect comment');
    }

    return comment;
  };
  ```

  replaceable with this:

  ```ts
  const parseComment = (comment: unknown): string => {
    return z.string().parse(comment);
  };
  ```
- It supports a bunch of other types too:
  - `z.string().date().parse(object.date)`
  - `z.string().optional().parse(object.comment)`
  - `z.nativeEnum(Weather).parse(object.weather)`
- and actually, you can defined a whole schema and parse it in one fell swoop:
  ```ts
  const newEntrySchema = z.object({
    weather: z.nativeEnum(Weather),
    visibility: z.nativeEnum(Visibility),
    date: z.string().date(),
    comment: z.string().optional(),
  })
  ```
  and then parse as so:
  ```ts
  try {
    const parsedNewEntry = newEntrySchema.parse(object)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.tatus(400).send({error: error.issues})
    }
  }
  ```

- You can use the zod schema to infer types...
  ```ts
  export type NewDiaryEntry = z.infer<typeof newEntrySchema>;
  ```

### Parsing the body in middleWare

Define the middleware:
```ts
const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newEntrySchema.parse(req.body);
    next()
  } catch (error: unknown) {
    next(error)
  }
}
```

Use it:
```ts
app.post("/", newDiaryParser, (req: Request<unknown, unknown, DiaryEntry>, res: Response<DiaryEntry>) => {

})
```

And define an error middleware:
```ts
const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({error: error.issues});
  } else {
    next(error);
  }
}

router.post("/", /* ... */)

router.use(errorMiddleware)
```

## React with Types

### Using Vite

UNIX:

```sh
pnpm create vite@latest my-app-name -- --template react-ts
```

WINDOWS:

```sh
pnpm create vite@latest my-app-name --template react-ts
```

This creates a projects with the following differences from previous work:
- `.jsx` files are now `.tsx`
- there's a `tsconfig.json` file which:
  - has the key `lib` that includes type definitions for browser stuff, like `document`
  - is running in bundler mode

### Basic pattern:

```tsx
interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps) => {
  return <h1>Hello, {props.name}</h1>;
};
```

Without the extra interface:

```tsx
const Welcome = ({name}: {name: string}) => {
  return <h1>Hello, {props.name}</h1>;
};
```

## Discriminated Unions

We can use a hard-coded text field; in this case `kind` to do some kind of nice inheritance/interface stuff:

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

Now when we check the `kind` type, TS knows what type it is:
```ts
const printShapeInfo = (shape: Shape) => {
  switch (shape.kind) {
    case "circle":
      console.log(`circle with radius ${shape.radius}`);
      break;
    case "square":
      console.log(`square with side length ${shape.sideLength}`);
      break;
    default:
      console.log(`Unknown shape ${shape}`)
    // ...
  }
}
```

## `never` for exhaustiveness checks...

Whenever we're coding all the different behaviors depending on the `kind` attribute, we can make sure the code is robust for new added type by placing this in the `default` clause:

```ts
default:
  const _exhaustiveCheck: never = shape
  break;
```

And that will create a linting/compiling error whenever the `Shape` type is extended, reminding you to extend the handling code.

## Typing with React hooks

### Cheatsheets
https://react-typescript-cheatsheet.netlify.app/

### Typescript can't infer types of arrays

So do something like:

```ts
const [notes, setNotes] = useState<Note[]>([])
```

### Events in forms

These should be typed `React.SyntheticEvent`, like so:

```ts
const handleClick = (event: React.SyntheticEvent) => {
  event.preventDefault()
  // ...
}
```

### Typing axios

```ts
axios.get<Note[]>( /* */ );
```

However, if the backend acts weird at all, TS isn't going to catch it. You should parse the backend's response just as we did (e.g. using zod)

## Types vs Interfaces

typescriptlang.org heuristic: use `interface` until you need to use features from `type`

## `Omit` with `Union` types

```ts
// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
type EntryWithoutId = UnionOmit<Entry, 'id'>;
```

(Otherwise the result isn't a union, but just the intersection of all the common types of the input union)


## Course Submission details

### How many Exercises?


```powershell
(git log --oneline -E --grep "^(Exercise )?9\.[0-9]+" --after "2024/01/01").Count
```

=> 30 exercises

### How long spent?

My first commit of unit 9 was: 96c63e953702804e37547feca11064771e2721cc

```powershell
$startTimestamps = (git log 96c63e953702804e37547feca11064771e2721cc^..HEAD -E --grep "^[ ]*start session[ ]*$" --pretty="%at")
$endTimestamps = (git log 96c63e953702804e37547feca11064771e2721cc^..HEAD -E --grep "^[ ]*end session[ ]*" --pretty="%at")
```

#### Fixing stuff

Shoot... these are not the same length. => Look through the git log and find a place where there was an end session without a corresponding start... the first commit after an end was 8a66bd8 =>

```sh
git log 8a66bd8..8a66bd8
```
to get the time, `Sat Sep 14 15:30:47 2024 -0500`, then

```sh
git commit --allow-empty --date "Sat Sep 14 15:30:47 2024 -0500" -m "start session"
```

#### Back to the calculation

Powershell to do the math:
```powershell
$total = 0
$previous = 0
for ($i=0; $i -lt $startTimestamps.Length; $i++) {
    $total += ($endTimestamps[$i] - $startTimestamps[$i])
}

Write-Host ($total / 60 / 60)
```

=> 18.68 hours