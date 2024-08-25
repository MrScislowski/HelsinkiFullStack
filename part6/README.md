## Flux architecture

```
ACTIONS -> DISPATCHER -> STORE -> VIEW
```

## Redux

Install:

```sh
pnpm install redux
pnpm install --save-dev deep-freeze
```

(deep freeze will ensure that the reducer has been defined as an immutable function)

### redux actions

- always have a `type` field
- conventionally have a `payload` field, too
- very simple action object for a counter:
  ```js
  {
    type: 'INCREMENT'
  }
  ```

### redux reducers

- named after `Array.reduce()` callback functions (conventionally taking `acc` and `cur`, and returning an updated accumulation value)
- reducers take `state` and `action`, and return an updated state
- counter example:
  ```js
  const counterReducer = (state = 0, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1
      case 'DECREMENT':
        return state - 1
      case 'ZERO':
        return 0
      default: // if none of the above matches, code comes here
        return state
    }
  }
  ```

These reducers are never called directly, but are encapsulated in the store:

```js
import { createStore } from 'redux'

const counterReducer //... as defined above

const store = createStore(counterReducer)
```

### redux dispatcher

- `dispatch` is a method of the store. E.g.
  ```js
  store.dispatch({ type: 'INCREMENT' })
  ```
- `getState` is also a method of the store:
  ```js
  console.log(`current value of the store is: ${store.getState()}`)
  ```
- `subscribe` is also a method of the store; you register callback functions that the store calls whenever an action is dispatched to the store. E.g, to print every chang in the store to the console:
  ```js
  store.subscribe(() => {
    const storeNow = store.getState()
    console.log(storeNow)
  })
  ```

### initial file layout:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  // ...
}

const store = createStore(counterReducer)

const App = () => {
  return (
    <div>
      <div>
        {store.getState()}
      </div>
      <button
        onClick={e => store.dispatch({ type: 'INCREMENT' })}
      >
        plus
      </button>
      <button
        onClick={e => store.dispatch({ type: 'DECREMENT' })}
      >
        minus
      </button>
      <button
        onClick={e => store.dispatch({ type: 'ZERO' })}
      >
        zero
      </button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
```

### redux action creators

It's not ideal to require the react components to know the type names. You can define them as their own functions:

```js
const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}
```

### sharing redux store with components

- There are multiple ways to share the Redux store with components
- What follows is the newest way: using the hooks API of the react-redux library

Install:

```sh
pnpm install react-redux
```

Restructure:

- `main.jsx`:

  ```js
  // ...
  import { Provider } from 'react-redux'
  // ...
  const store = createStore(noteReducer)

  ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  ```

