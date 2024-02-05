require("dotenv").config();
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to MongoDB"))
  .catch((error) => console.log("error connecting to MongoDB", error.message));

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: String!
    genres: [String]!
  }

  type Author {
    name: String!
    id: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String]!
    ): Book
    addAuthor(name: String!, born: String): Author!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

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
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author });
      const book = new Book({
        ...args,
        author: author._id,
      });
      try {
        return await book.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args[Object.keys(error.errors)[0]],
            error,
          },
        });
      }
    },
    addAuthor: async (root, args) => {
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
    editAuthor: async (root, args) =>
      await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      ),
  },
  Author: {
    bookCount: async (root) => await Book.countDocuments({ author: root._id }),
  },
  Book: {
    author: async (root) => await Author.findById(root.author),
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
