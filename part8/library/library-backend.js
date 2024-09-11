const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { GraphQLError } = require("graphql");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Book = require("./models/Book");
const Author = require("./models/Author");
const User = require("./models/User");

const jwt = require("jsonwebtoken");

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

  type User {
    username: String!
    favoriteGenre: String!
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

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
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
    me: (root, args, context) => context.user,
  },

  Mutation: {
    addBook: (root, args, context) => {
      if (!context.user)
        throw new GraphQLError("Failed to add book", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: "user token required to add book",
          },
        });
      return Author.findOne({ name: args.author })
        .then((possiblyAuthor) => {
          return possiblyAuthor || new Author({ name: args.author }).save();
        })
        .catch((error) => {
          throw new GraphQLError("Adding author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              error,
            },
          });
        })
        .then((author) => {
          const newBook = new Book({ ...args, author: author._id });
          return newBook.save().then((book) => book.populate("author"));
        })
        .then((book) => {
          console.log("about to fire pubsub.publish...");
          pubsub.publish("BOOK_ADDED", { bookAdded: book });
          return book;
        })
        .catch((error) => {
          throw new GraphQLError("Adding book failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              error,
            },
          });
        });
    },

    editAuthor: async (root, args, context) => {
      if (!context.user)
        throw new GraphQLError("Failed to edit author", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: "user token required to edit author",
          },
        });
      const response = await Author.findOneAndUpdate(
        { name: args.name },
        { $set: { born: args.setBornTo } },
        { new: true }
      );
      return response;
    },

    createUser: async (root, args) => {
      if (!args.username || !args.favoriteGenre)
        throw new GraphQLError("invalid user creation request", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: "Need username and favorite genre properties",
          },
        });
      const createdUser = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      try {
        await createdUser.save();
      } catch (error) {
        throw new GraphQLError("unable to save new user", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
      return createdUser;
    },

    login: async (root, args) => {
      if (!args.username || !args.password)
        throw new GraphQLError("invalid login attempt", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: "Need username and password",
          },
        });

      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret")
        throw new GraphQLError("invalid login attempt", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: "username/password not correct",
          },
        });

      return { value: jwt.sign({ id: user._id }, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => {
        console.log("about to fire subscription handler for bookAdded");
        pubsub.asyncIterator("BOOK_ADDED");
      },
    },
  },
};

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          );
          const user = await User.findById(decodedToken.id);
          return { user };
        }
      },
    })
  );

  const PORT = 4000;

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  );
};

start();
