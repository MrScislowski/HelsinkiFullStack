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