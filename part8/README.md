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
  ```
