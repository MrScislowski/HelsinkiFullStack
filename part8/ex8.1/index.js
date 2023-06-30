const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const config = require("./config");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Author = require("./models/author");
const Book = require("./models/book");

const MONGODB_URI = config.DB_URL;
console.log(`connecting to ${MONGODB_URI}`);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

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

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

// TODO: use mongoose/mongoDB to do all of the resolvers
const resolvers = {
  Query: {
    bookCount: async () => {
      return Book.collection.countDocuments();
    },
    authorCount: async () => {
      return Author.collection.countDocuments();
    },
    allBooks: async (root, args) => {
      return Book.find({}).populate("author");
    },
    allAuthors: async () => {
      const allBooks = await Book.find({}).populate("author").lean();
      const allAuthors = await Author.find({}).lean();

      const modifiedAuthors = allAuthors.map((author) => {
        const bookCount = allBooks.reduce((count, book) => {
          return book.author.name === author.name ? count + 1 : count;
        }, 0);

        return {
          ...author,
          bookCount: bookCount,
        };
      });
      return modifiedAuthors;
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      let foundAuthor = await Author.findOne({ name: args.name });
      if (!foundAuthor) {
        foundAuthor = new Author({ name: args.author });
        foundAuthor = await foundAuthor.save();
      }

      const newBook = new Book({ ...args, author: foundAuthor });
      return newBook.save();
    },
    editAuthor: async (root, args) => {
      return Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      );
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
