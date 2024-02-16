# part 1

## Note to self on creating apps

NB: I'm using `pnpm`, so used 

```bash
pnpm create vite@latest part1 -- template react
```

Then selected `React` for framework, and `Javascript` for variant in the interactive setup (I don't know why the setup was interactive since I passed in the react template...).

## Notes on a - Introduction to react

* react components are javascript functions that return JSX
* JSX returned by React components is compiled to Javascript by Babel (`create-react-app` and `vite` projects handle this automatically)
* the first letter of React components must be uppercase
* React will only render primitive values inside curly braces (or arrays of primitive values)

