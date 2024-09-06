import { gql } from "@apollo/client";

const ADD_BOOK = gql`
  mutation addBookWithInfo(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
    }
  }
`;

const EDIT_AUTHOR_BIRTHYEAR = gql`
  mutation editAuthorBirthyear($name: String!, $year: Int!) {
    editAuthor(name: $name, setBornTo: $year) {
      id
    }
  }
`;

export default { ADD_BOOK, EDIT_AUTHOR_BIRTHYEAR };
