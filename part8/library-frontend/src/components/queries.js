import { gql } from "@apollo/client";

const GET_ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

const GET_ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

const GET_CURRENT_USER = gql`
  query {
    me {
      favoriteGenre
    }
  }
`;

export default { GET_ALL_AUTHORS, GET_ALL_BOOKS, GET_CURRENT_USER };
