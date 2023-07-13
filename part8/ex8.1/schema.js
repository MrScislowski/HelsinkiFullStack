const typeDefs = `
type Author {
name: String!
id: String!
bookCount: Int
born: Int
}

type Book {
    title: String!
    published: String!
    author: Author!
    id: String!
    genres: [String!]!
}

type User {
  username: String!
  favoriteGenre: String
  id: ID!
}

type Token {
  value: String!
}

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
    getAllUsers: [User!]!
  }

  type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`;

module.exports = typeDefs;
