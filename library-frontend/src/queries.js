import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`;

export const ALL_GENRES = gql`
  query AllBooks {
    allBooks {
      genres
    }
  }
`;

export const ALL_BOOKS_GENRE = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      author {
        name
      }
      title
      published
      genres
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
      author {
        name
      }
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

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      favoriteGenre
      username
    }
  }
`;

export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published
    author {
      name
      born
    }
    genres
  }
`;

export const BOOK_ADDED = gql`
  subscription BookAdded {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;
