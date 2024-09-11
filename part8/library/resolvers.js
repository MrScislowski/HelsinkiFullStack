const Book = require("./models/Book");
const Author = require("./models/Author");
const User = require("./models/User");

const { GraphQLError } = require("graphql");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

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

module.exports = { resolvers };
