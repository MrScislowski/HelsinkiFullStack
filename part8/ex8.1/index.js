const { ApolloServer } = require("@apollo/server");
const { GraphQLError } = require("graphql");
const { startStandaloneServer } = require("@apollo/server/standalone");
// const { v1: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("./config");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

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
`;

const resolvers = {
  Query: {
    bookCount: async () => {
      return Book.collection.countDocuments();
    },
    authorCount: async () => {
      return Author.collection.countDocuments();
    },
    allBooks: async (root, args) => {
      let query = {};
      if (args.author) {
        const bookAuthor = await Author.findOne({ name: args.author });
        if (bookAuthor) {
          query = { ...query, author: bookAuthor._id };
        } else {
          return [];
        }
      }

      if (args.genre) {
        query = { ...query, genres: args.genre };
      }

      return Book.find(query).populate("author");
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
    getAllUsers: async () => {
      return User.find({});
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let foundAuthor = await Author.findOne({ name: args.author });
      if (!foundAuthor) {
        foundAuthor = new Author({ name: args.author });
        try {
          // TODO: graphQL error
          foundAuthor = await foundAuthor.save();
        } catch (error) {
          throw new GraphQLError(
            "Failed to create the author of your proposed book",
            {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args.name,
                errorMessage: error.message,
              },
            }
          );
        }
      }

      const newBook = new Book({ ...args, author: foundAuthor });

      return newBook.save().catch((error) => {
        throw new GraphQLError("Creating the new book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            errorMessage: error.message,
          },
        });
      });
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      return Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      );
    },
    createUser: async (root, args) => {
      const newUser = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      console.log(`newUser is: `);
      console.dir(newUser);
      const saveResult = await newUser.save();
      console.log("save result is: ");
      console.dir(saveResult);
      return saveResult;
    },
    login: async (root, args) => {
      const proposedUser = await User.findOne({
        username: args.username,
      });
      if (!proposedUser || args.password !== "password1") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
            errorMessage: "remember, password has to be password1",
          },
        });
      }
      const { _id: id, username, favoriteGenre } = proposedUser;
      const token = jwt.sign({ id, username, favoriteGenre }, config.SECRET);
      return { value: token };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), config.SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

// startStandaloneServer(server, {
//   listen: { port: 4000 },
//   context: async ({ req, res }) => {
//     const auth = req ? req.headers.authorization : null;
//     if (auth && auth.startsWith("Bearer ")) {
//       const decodedToken = jwt.verify(
//         auth.substring(7),
//         process.env.JWT_SECRET
//       );
//       const currentUser = await User.findById(decodedToken.id).populate(
//         "friends"
//       );
//       return { currentUser };
//     }
//   },
// }).then(({ url }) => {
//   console.log(`Server ready at ${url}`);
// });
