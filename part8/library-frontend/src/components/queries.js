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
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export default { GET_ALL_AUTHORS, GET_ALL_BOOKS };
