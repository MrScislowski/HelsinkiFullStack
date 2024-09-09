const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
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
    author: Author!
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
    bookCount: (root) => {
      return Book.countDocuments({ author: root._id }).then((count) => count);
    },
  },

  Query: {
    bookCount: () => Book.countDocuments().then((res) => res),
    authorCount: () => Author.countDocuments().then((res) => res),
    allBooks: async (root, args) => {
      let searchOptions = {};
      if (args.author) {
        const authorId = (await Author.findOne({ name: args.author }))?._id;
        if (!authorId) return [];
        searchOptions.author = authorId;
      }

      if (args.genre) {
        searchOptions.genres = args.genre;
      }

      return Book.find(searchOptions).populate("author");
    },
    allAuthors: () => Author.find({}).then((res) => res),
  },

  Mutation: {
    addBook: (root, args) => {
      return Author.findOne({ name: args.author })
        .then((possiblyAuthor) => {
          return possiblyAuthor || new Author({ name: args.author }).save();
        })
        .then((author) => {
          const newBook = new Book({ ...args, author: author._id });
          return newBook.save().then((book) => book.populate("author"));
        })
        .then((book) => book);
    },

    editAuthor: async (root, args) => {
      const response = await Author.findOneAndUpdate(
        { name: args.name },
        { $set: { born: args.setBornTo } },
        { new: true }
      );
      return response;
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
