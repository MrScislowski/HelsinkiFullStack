## GraphQL-server

### Intro / Motivation

- GraphQL was developed by Facebook
- It's an alternative to REST
  - REST is "resource based" (each resource has its own address which identifies it). All operations done to the resource are done with HTTP requests to its url
  - often we need to make multiple REST requests to get the info we need, or we get way more info than we wanted
- In GraphQL, the code on the browser forms a query describing the data wanted, and sends it using a POST request

### Schemas & Queries

#### Schema

Here's an example schema (for a phonebook):

```js
type Person {
  name: String! // mandatory because of "!"
  phone: String // optional
  street: String!
  city: String!
  id: ID! // "ID" fields are strings, but GraphQL ensures they're unique
}

type Query { // this lists the queries that can be made to the API
  personCount: Int! // must return an integer (cannot return null)
  allPersons: [Person!]!
  findPerson(name: String!): Person // this may return null
}
```

#### Query

- Simplest query:
  ```js
  query {
    personCount
  }
  ```
  - Example response:
    ```json
    {
      "data": {
        "personCount": 3
      }
    }
    ```

- More complicated query, because you have to specify what info you want:
  ```js
  query {
    allPersons {
      name
      phone
    }
  }
  ```

  - Example response:
    ```json
    {
      "data": {
        "allPersons": [
          {
            "name": "Arto Hellas",
            "phone": "040-123543"
          },
          {
            "name": "Matti Luukkainen",
            "phone": "040-432342"
          },
          {
            "name": "Venla Ruuska",
            "phone": null
          }
        ]
      }
    }
    ```

- Query using a parameter
  ```js
  query {
    findPerson(name: 'Joe Bloggs') {
      phone
      city
      id
    }
  }

### Scope of GraphQL

- Only describes the data moving between the server and the client. On the client, the data can be organized & saved any way we like

### Apollo Server

- Install

  ```sh
  pnpm install @apollo/server graphql
  ```

- Simple Example:
  ```js
  const { ApolloServer } = require('@apollo/server')
  const { startStandaloneServer } = require('@apollo/server/standalone')

  let persons = [ /* ... objects of shape {name, phone, street, city, id} */ ]

  // This is the GraphQL Schema
  const typeDefs = `
    type Person {
      name: String!
      phone: String
      street: String!
      city: String!
      id: ID!
    }

    type Query {
      personCount: Int!
      allPersons: [Person!]!
      findPerson(name: String!): Person
    }
  `

  const resolvers = {
    Query: {
      personCount: () => persons.length,
      allPersons: () => persons,
      findPerson: (root, args) =>
        persons.find(p => p.name === args.name)
    }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port: 4000 },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
  ```


- When run in development mode, `http://localhost:4000` has "query your server" option which takes you to Apollo Studio Explorer

### Resolvers

- Each resolver is given 4 positional arguments:
  - `obj`, or `root` in our example
  - `args`
  - `context`
  - `info`
- Apollo defines default resolvers for your schema, for example
  ```js
  Person: {
    name: (root) => root.name,
    phone: (root) => root.phone,
    // ...
  }
  ```
- You can overwrite these; for example, you could define the address of all persons to be Manhattan, NY by using:
  ```js
  Person: {
    // ...
    street: (root) => "Manhattan",
    city: (root) => "New York"
  }
  ```

### Nested Stuff In Schema

- Change Schema (add Address type):
  ```js
  type Address {
    street: String!
    city: String!
  }

  type Person {
    // ...
    address: Address!
  }
  // ...
  ```
- Change queries accordingly:
  ```js
  query {
    findPerson(name: "Joe Bloggs") {
      address {
        city
        street
      }
    }
  }
  ```

- We don't need to change the way we store the objects in the backend/server. But now because the graphQL schema and the server schema aren't the same, we won't be able to use as many default resolvers

- Change resolvers accordingly:
  ```js
  const resolvers = {
    // ...
    Person: {
      address: (root) => return { street: root.street, city: root.city }
    }
  }

### Mutations

- all operations which cause a change are done with mutations
- Example add person mutation...:
  - Schema:
  ```js
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
  }
  ```
  - Resolver:
  ```js
  const { v1: uuid } = require('uuid')
  // ...
  const resolvers = {
    // ...
    Mutation {
      addPerson: (root, args) => {
        const person = { ...args, id: uuid() }
        persons = persons.concat(person)
        return person
      }
    }
  }
  ```
  - Calling the mutation:
  ```js
  mutation {
    addPerson(
      name: "Pekka Mikkola"
      phone: "045-2374321"
      street: "Vilppulantie 25"
      city: "Helsinki"
    ) {
      name
      phone
      address{
        city
        street
      }
      id
    }
  }
  ```

### Error handling

- GraphQL handles basic validation itself (e.g. not providing the appropriate parameters)
- For more complex situations, you can throw a `GraphQLError`, and look up the appropriate error code. e.g., to prevent the same name bing added twice:
  ```js
  const { GraphQLError } = require('graphql')
  //...
  const resolvers = {
    // ...
    addPerson: (root, args) => {
      if (persons.find(p => p.name === args.name)) {
        throw new GraphQLError('name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      // ...
    }
  }

### GraphQL Enums

- Add to schema:
  ```js
  enum YesNo {
    YES
    NO
  }

  type Query {
    // ...
    allPersons(phone: YesNo): [Person!]!
    // ...
  }
  ```
- Implement in resolver:
  ```js
  Query: {
    // ...
    allPersons: (root, args) => {
      if (!args.phone) {
        return persons
      }

      const filterByPhone = (person) =>
        args.phone === 'YES' : person.phone : !person.phone

      return persons.filter(filterByPhone)
      },
      // ...
  }
  ```

### Change phone number

- Query aka mutation

  ```js
  type Mutation {
    editNumber(
      name: string!
      phone: String!
    ): Person
  }
  ```

- Resolver:
  ```js
  const resolvers = {
    // ...
    Mutation {
      editNumber: (root, args) => {
        const oldInfo = persons.find(p => p.name === args.name)
        if (!oldInfo) return null
        const newInfo = { ...oldInfo, phone: args.phone }
        persons = persons.map(p => p.id !== newInfo.id ? p : newInfo )
        return newInfo
      }
    }
    // ...
  }
  ```

### Nested Queries (queries inside queries etc)

- Names can't clobber, so:
  ```js
  query {
    havePhone: allPersons(phone: YES) {
      name
    }
    phoneless: allPersons(phone: NO) {
      name
    }
  }
  ```
- return something like:
  ```js
  {
    "data": {
      "havePhone": [
        {
          "name": "Arto Hellas"
        },
        {
          "name": "Matti Luukkainen"
        }
      ],
      "phoneless": [
        {
          "name": "Venla Ruuska"
        }
      ]
    }
  }
  ```

## GraphQL With React

### Using POST requests (bad idea)

In theory we could do:

```http
POST http://localhost:4000/graphql

Content-Type: application/json

{
  "query": "query{ allPersons{ name } }"
}

```

### Popular clients

- Relay by facebook
- Apollo client <- most popular, so course uses it


### Using apollo client

#### Setup

- Install

  ```sh
  pnpm install @apollo/client graphql
  ```

- Provide to `App` in `main.jsx` or whatever:

  ```js
  import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
  } from '@apollo/client'

  const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache(),
  })

  ReactDOM.createRoot(document.getElementById('root')).render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  )
  ```

#### Queries

#### w/o parameters

```js
import { gql, useQuery } from '@apollo/client'

const ALL_PERSONS = gql`
query {
  allPersons {
    name
    id
  }
}
`
const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      {result.data.allPersons.map(p => p.name).join(', ')}
    </div>
  )
}
```

#### w/ parameters

- GraphQL allows parameters like this:
  ```js
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      address {
        city
      }
    }
  }

  {
    "nameToSearch": "Bob"
  }
  ```
- These "search" type requests are usually not done immediately on component render, so we can either use `useLazyQuery`, or pass something to the `skip` option of the `useQuery` hook.
  ```js
    const FIND_PERSON = gql`
      query findPersonByName($nameToSearch: String!) {
        findPerson(name: $nameToSearch) {
          name
          phone
          id
          address {
            street
            city
          }
        }
      }
    `

    const Persons = ({ persons }) => {
      const [nameToSearch, setNameToSearch] = useState(null)
      const result = useQuery(FIND_PERSON, {
        variables: { nameToSearch },
        skip: !nameToSearch,
      })

      if (nameToSearch && result.data) {
        return (
          <Person
            person={result.data.findPerson}
            onClose={() => setNameToSearch(null)}
          />
        )
      }

      // ... return all people names...
    }
  ```

#### example of 'addPerson' mutation w/ client

```js
const ADD_PERSON = gql`
query addPersonWithDetails($personName: String!, $personCity: String!) {
  addPerson(name: $personName, city: $personCity) {
    id
    name
    city
    }
  }
`
const App = () => {
  const [ createPerson, {data, loading, error} ] = useMutation(ADD_PERSON)

  // ...
  useMutation(ADD_PERSON, { variables: {personName: 'JOE', personCity: 'BALTIMORE'}})
}
```

So... unlike react query, you call the `createPerson` object that was returned directly, and don't call a `.mutate` method on it

#### Updating Cache

- "poll" the server (execute query periodically at specified interval). NB: there's excessive network traffic for this solution.
  ```js
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000
  })
  ```
- trigger refetching queries inside mutation. NB: cuts down on network traffic, but won't update when another user changes the state of the database.
  ```js
  const [ createPerson, {data, loading, error} ] = useMutation(ADD_PERSON, {
    refetchQueries: [ {query: ALL_PERSONS} ]
  })
  ```

#### Error handling in apollo

```js
const [ createPerson ] = useMutation(ADD_PERSON), {
  // ...
  onError: (error) => {
    console.log(error.grapQLErrors)
    // and whatever else you want to do here
  }
}
```

#### Response handling (e.g. if a problem has occurred but doesn't rise to graphQL error):
```js
const [ changeNumber, result ] = useMutation(EDIT_NUMBER)

// ...

useEffect(() => {
  if (result.data && result.data.editNumber === null) {
    setError('person not found')
  }
}, [result.data])
```


#### Application State

Apollo client manages a lot of the application state, like react-query. So this may replace, e.g., redux.

#### Using `context` to store user information

"Context is the right place to do things which are shard by multiple resolvers, like user identification"

In server:

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  // THIS IS THE NEW STUFF...
  // ******************************
  context: async ({ req, res }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7), process.env.JWT_SECRET
        )
        const currentUser = await User
          .findById(decodedToken.id).populate('friends')
        return { currentUser }
      }
    },
  // ******************************
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
```

In client/resolver:

```js
Query: {
  // ...
  me: (root, args, context) => {
    return context.currentUser
  }
},
```

#### resetting the Apollo cache

Once logging out happens, we want to get rid of any data in the cache (it may have info that only logged in users should be able to see).

```js
const client = useApolloClient()
// ...
client.resetStore()
```

#### adding a token to a header using Apollo

```js

import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {

  const token = localStorage.getItem('phonenumbers-user-token')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})
```

#### updating cache manually (instead of refetching)

Instead of causing a re-fetch of the data:
```js
const [ createPerson ] = useMutation(CREATE_PERSON, {
  refetchQueries: [ {query: ALL_PERSONS } ],
  // ...
})
```

We can do:
```js
const [ createPerson ] = useMutation(CREATE_PERSON, {
  update: (cache, response) => {
    cache.updateQuery({query: ALL_PERSONS }, ({ allPersons }) => {
      return {
        allPersons: allPersons.concat(response.data.addPerson),
      }
    })
  }
})
```

#### disable cache (for debugging etc)

the `fetchPolicy` property can be set to "no-cache"; e.g.

```js
  useQuery(ALL_PERSONS, {
    fetchPolicy: "no-cache"
  })
```

### Fragments

These two queries return the same shape of information:

- ```js
  query {
    findPerson(name: "Bob") {
      name
      phone
      address {
        street
        city
      }
    }
  }
  ```

- ```js
  query {
    allPersons {
      name
      phone
      address {
        street
        city
      }
    }
  }
  ```

Using this fragment:
```js
fragment PersonDetails on Person {
  name
  phone
  address {
    street
    city
  }
}
```

Can shorten these to:
- ```js
  query {
    allPersons {
      ...PersonDetails
    }
  }
  ```

- ```js
  query {
    findPerson(name: "bob") {
      ...PersonDetails
    }
  }
  ```

NB: clients are defined in the client, and must be declared whenever used. Commonly like this:

```js
const PERSON_DETAILS = gql`
  fragment PersonDetails on Person {
    id
    name
    phone
    address {
      street
      city
    }
  }
`

export const FIND_PERSON = gql`
  query findPersonByName($name: String!) {
    findPerson(name: $name) {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`
```

### Subscriptions

(operation type in addition to `query` and `mutation` types). Clients sign up for subscriptions, and the server sends notifications to subscribers when changes happen on the server. WebSockets are used by Apollo under the hood

### Refactored structure

- `schema.js`
  ```js
  const typeDefs = `
    type User {
    //...
  `

  module.exports = typeDefs
  ```
- `resolvers.js`
  ```js
  const resolvers = {
    Query: {
      // ...
  }

  module.exports = resolvers
  ```

### Set up server for subscriptions

`startStandaloneServer` does not allow subscriptions; need to use `expressMiddleware`, so that the graphQL server is middleware.

```sh
pnpm install express cors graphql-ws ws @graphql-tools/schema graphql-subscriptions
```

`index.js`:

```js
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
// ...

// setup is now within a function
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
      ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id).populate(
            'friends'
          )
          return { currentUser }
        }
      },
    }),
  )

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
```

### Subscriptions on server

- Schema:
  ```js
  type Subscription {
    personAdded: Person!
  }
  ```
- Resolver:
  ```js
  const { PubSub } = require('graphql-subscriptions')
  const pubsub = new PubSub()

  // ...
  const resolvers = {
    // ...
    Mutation: {
      addPerson: async (root, args, context) => {
        // ...

        pubsub.publish('PERSON_ADDED', { personAdded: person })

        return person
      },
    },
    Subscription: {
      personAdded: {
        subscribe: () => pubsub.asyncIterator('PERSON_ADDED')
      }
    }
  }

### Subscriptions on client

- dependency:
  ```sh
  pnpm install graphql-ws
  ```
- `main.jsx` changes:
  ```js
  import {
    // ...
    split
  } from '@apollo/client'
  import { getMainDefinition } from '@apollo/client/utilities'
  import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
  import { createClient } from 'graphql-ws'
  // ...

  const wsLink = new GraphQLWsLink(
    createClient({ url: 'ws://localhost:4000' })
  )

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    authLink.concat(httpLink)
  )

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink
  })
  ```
- `queries.js`
  ```js
  export const PERSON_ADDED = gql`
    subscription {
      personAdded {
        ...PersonDetails
      }
    }
    ${PERSON_DETAILS}
  `
  ```
- `App.jsx` (a bit complicated b/c `PersonForm` adds the person to the cache was well as this subscription)
  ```js
  import { useQuery, useMutation, useSubscription } from '@apollo/client'

  export const updateCache = (cache, query, addedPerson) => {
    const uniqByName = (a) => {
      let seen = new Set()
      return a.filter((item) => {
        let k = item.name
        return seen.has(k) ? false : seen.add(k)
      })
    }
    cache.updateQuery(query, ({ allPersons }) =>
    {
      return {
        allPersons: uniqByName(allPersons.concat(addedPerson)),
        }
    })
  }

  const App = () => {
    // ...

    useSubscription(PERSON_ADDED, {
      onData: ({ data, client }) => {
        const addedPerson = data.data.personAdded
        notify(`${addedPerson.name} added`)

        updateCache(client.cache, { query: ALL_PERSONS}, addedPerson)
        }
      })
    }
  ```
- Can also use that `updateCache` function in `PersonForm`
  ```js
  import { updateCache } from '../App'

  const PersonForm = ({ setError }) => {
    // ...

    const [createPerson] = useMutation(CREATE_PERSON, {
      onError: //...
      update: (cache, response) => {
        updateCache(cache, { query: ALL_PERSONS }, response.data.addPerson)
      }
    })
  }
  ```

### What is the N + 1 problem?

It's a performance anti-pattern where you make N + 1 database calls, when you could just do one or two complex calls.

E.g. you have a collection of `Car` objects, and each `Car` has a collection of `Wheel` objects. In other words, `Car` -> `Wheel` is a 1-to-many relationship. You want to print out all the wheels of each car. If you do:

```sql
SELECT * FROM Cars;
```

then for each `Car`

```sql
SELECT * FROM Wheel WHERE CarId = ?
```

You do 1 select to get the list of cars, then N to get the wheels of the N cars.

It's more optimal to do

```sql
SELECT * FROM Wheel
```

then do the join in memory, or do an explicit SQL join

I guess most ORMs have Lazy loading / eager loading...


### stuff that didn't get covered

GraphQL foundation's DataLoader library offers good solution for n + 1 problem


### Seeing what Mongoose is doing under the hood

This lets you see what queries mongoose is sending to mongodb, which I find quite cool:

```js
mongoose.set("debug", true);
```