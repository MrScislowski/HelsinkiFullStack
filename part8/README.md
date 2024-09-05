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