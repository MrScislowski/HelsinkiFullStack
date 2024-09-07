const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Book = require("./models/Book");
const Author = require("./models/Author");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("connected to MongoDB"))
  .catch((error) =>
    console.log("error connecting to MongoDB: ", error.message)
  );

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
  Author: {
    bookCount: async (root) => {
      // TODO later
      return 42;
    },
  },

  Query: {
    bookCount: () => Book.countDocuments().then((res) => res),
    authorCount: () => Author.countDocuments().then((res) => res),
    allBooks: (root, args) => {
      // TODO: deal with args.author and args.genre filters later
      return Book.find({}).then((res) => res);
    },
    allAuthors: () => Author.find({}).then((res) => res),
  },

  Mutation: {
    addBook: (root, args) => {
      const newBook = { ...args, id: uuid() };
      books = books.concat(newBook);

      // If this is a new author, add them to the DB
      if (!authors.find((a) => a.name === newBook.author)) {
        authors = authors.concat({
          name: newBook.author,
          id: uuid(),
        });
      }
      return newBook;
    },

    editAuthor: (root, args) => {
      const foundAuthor = authors.find((a) => a.name === args.name);

      if (!foundAuthor) return null;

      const updatedAuthor = { ...foundAuthor, born: args.setBornTo };
      authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a));

      return updatedAuthor;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
