import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query Query {
    allBooks {
      author
      published
      title
    }
  }
`;

export const ADD_BOOK = gql`
  mutation Mutation(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      author
      genres
      id
      published
      title
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation Mutation($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      born
      name
    }
  }
`;
