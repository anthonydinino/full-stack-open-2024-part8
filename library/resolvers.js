const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Book = require("./models/book");
const User = require("./models/user");
const Author = require("./models/author");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        query["author"] = author._id;
      }
      if (args.genre) {
        query["genres"] = { $elemMatch: { $eq: args.genre } };
      }
      return await Book.find(query);
    },
    allAuthors: async () => await Author.find({}),
    me: async (root, args, context) => context.currentUser,
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser)
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      let author = await Author.findOne({ name: args.author });
      if (!author) author = await new Author({ name: args.author }).save();
      const book = new Book({
        ...args,
        author: author._id,
      });
      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args[Object.keys(error.errors)[0]],
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });
      return book;
    },
    addAuthor: async (root, args, context) => {
      if (!context.currentUser)
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      const author = new Author({ name: args.name, born: args.born });
      try {
        return await author.save();
      } catch (error) {
        throw new GraphQLError("Saving author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args[Object.keys(error.errors)[0]],
            error,
          },
        });
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser)
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      return await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      );
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: [Object.keys(error.errors)[0]],
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
  Author: {
    bookCount: async (root) => await Book.countDocuments({ author: root._id }),
  },
  Book: {
    author: async (root) => await Author.findById(root.author),
  },
};

module.exports = resolvers;
