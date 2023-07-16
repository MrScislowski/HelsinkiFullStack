const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const config = require("./config");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

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
          id: author._id,
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

      newBook.save().catch((error) => {
        throw new GraphQLError("Creating the new book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            errorMessage: error.message,
          },
        });
      });

      pubsub.publish("BOOK_ADDED", { bookAdded: newBook });

      return newBook;
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
      const saveResult = await newUser.save();
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
