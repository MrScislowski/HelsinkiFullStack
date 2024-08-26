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
  NB: All child components of `App` have access to the store implicitly through `useDispatch` and `useSelector` hooks.

- reducer and action creators in `reducers/noteReducer.js`:
  ```js
  const noteReducer = (state = [], action) => {
    // ...
  }

  export const createNote = (content) => {
    // ...
  }

  export const toggleImportanceOf = (id) => {
    // ...
  }

  export default noteReduce
  ```
  To import the default exports:
  `import noteReducer from './noteReducer.js'`

  To import the others,
  `import { createNote, toggleImportanceOf } from './noteReducer.js'`

- `App.jsx`:

  ```js
  import { createNote, toggleImportanceOf } from './reducers/noteReducer'
  import { useSelector, useDispatch } from 'react-redux'

  const App = () => {
    const dispatch = useDispatch()
    const notes = useSelector(state => state)
    // more interesting selector:
    // const importantNotes = useSelector(state => state.filter(note => note.important))

    const addNote = (event) => {
      // ...
      dispatch(createNote(content))
    }

    const toggleImportance = (id) => {
      dispatch(toggleImportanceOf(id))
    }

    return (
      // ...
    )
  }

  export default App
  ```

### radio button group modifying state

Since all these have the same `name` attribute, they form a button group where only one option can be selected

```js
all <input type="radio" name="filter"
  onChange={() => filterSelected('ALL')} />
important    <input type="radio" name="filter"
  onChange={() => filterSelected('IMPORTANT')} />
nonimportant <input type="radio" name="filter"
  onChange={() => filterSelected('NONIMPORTANT')} />
```

### complex state => make multiple reducers and combine them

```js
import { createStore, combineReducers } from 'redux'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

// ...

const notes = useSelector(state => {
  switch (state.filter) {
    case 'IMPORTANT':
      return state.notes.filter(note => note.important)
    case 'NONIMPORTANT':
      return state.notes.filter(note => !note.important)
    case 'ALL':
      return state.notes
    default:
      return state.notes
  } })

// NB: simplification possible if you do
// useSelector(({ filter, notes }) => ...)
```

NB: every action gets handled in every part of the combined reducer (every reducer "listens" to all of the dispatched actions)

## Redux Toolkit

```sh
pnpm install @reduxjs/toolkit
```

- `createSlice` replaces writing separate reducers and action creators
  ```js
  const initialState = {
    // ...
  }

  const noteSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
      createNote(state, action) {
        // ...
      },
      toggleImportanceOf(state, action) {
        // ...
      }
    },
  })
  ```
  - `name` parameter provides prefix for action type values. (e.g. 'notes/createNote' is an action type)
  - initial state is baked in
  - reducers are allowed to violate immutability b/c redux toolkit uses the Immer library with reducers
- `createSlice` returns on object containing the reducers as well as the action creators defined in the `reducers` parameter
  ```js
  export const { createNote, toggleImportanceOf } = noteSlice.actions
  export default noteSlice.reducer
  ```
- `configureStore` replaces `createStore` plus `combineReducers`:
  ```js
  import { configureStore } from '@reduxjs/toolkit'
  //...
  const store = configureStore({
    reducer: {
      notes: noteReducer,
      filter: filterReducer
    }
  })
  // ...
  ```

### console.log in redux toolkit

Because `Immer` is used in reducers in `createSlice`, to print `state`,

```js
import { createSlice, current } from '@reduxjs/toolkit'
// ...
console.log(current(state))
```

### redux devtools for chrome

Recommended to inspect store / dispatch from browser

### Redux Thunk

- is middleware enabled by default when using redux toolkit's `configureStore` function
- it means that if you send dispatch a function (instead of an object w/ type & action), it will give it `dispatch` and `getState` as arguments
- => we can implement asynchronous action creators (which wait for completion of an async operation, then dispatch some action which changes the store's state)
- they do have to be defined outside the `createSlice` call
- e.g.
  ```js
  const noteSlice = createSlice(/* ... */)
  export const { createNote, toggleImportanceOf /* ... */ } = noteSlice.actions
  export const initializeNotes = () => {
    return async dispatch => {
      const notes = await noteService.getAll()
      dispatch(setNotes(notes))
    }
  }
  ```
  can then be used like this in the `App` component:
  ```js
  import { initializeNotes } from './reducers/noteReducer'

  const App = () => {
    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(initializeNotes())
    }, [])

    // ...
  }
  ```

  ## React Query

  - Installing:
    ```sh
    pnpm install @tanstack/react-query
    ```

  - Setting up the provider in the `main.jsx` file:
    ```js
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
    // ...

    const queryClient = new QueryClient()

    ReactDOM.createRoot(document.getElementById('root')).render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )
    ```

  - using the query in `App`:
    ```js
    // ...
    import { useQuery } from '@tanstack/react-query'

    const App = () => {
      // ...

      const result = useQuery({
        queryKey: ['notes'],
        queryFn: () => axios.get('http://localhost:3001/notes').then(res => res.data)
      })

      if ( result.isLoading ) {
        return <div>loading data...</div>
      }

      const notes = result.data

      return (
        //...
      )
    }
    ```

  - using mutations (refetching entire query)
    ```js
    // ...
    import { useMutation, useQueryClient } from '@tanstack/react-query'

    const App = () => {
      const queryClient = useQueryClient()

      const newNoteMutation = useMutation({
        mutationFn: newNote => axios.post(baseUrl, newNote).then(res => res.data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['notes' ]})
        },
      })

      const addNote = async (event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.note.value = ''
        newNoteMutation.mutate({ content, important: true })
      }
    }
    ```

  - optimizing performance to manually update query state maintained by React Query
    ```js
    const newNoteMutation = useMutation({
      mutationFn: /* ... */,
      onSuccess: (newNote) => {
        const notes = queryClient.getQueryData(['notes'])
        queryClient.setQueryData(['notes'], notes.concat(newNote))
      },
    })
    ```
