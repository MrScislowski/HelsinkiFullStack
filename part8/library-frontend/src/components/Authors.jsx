import { gql, useQuery } from "@apollo/client";

const GET_ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

const Authors = (props) => {
  const authorsQuery = useQuery(GET_ALL_AUTHORS);

  if (!props.show) {
    return null;
  }

  if (!authorsQuery.data) {
    return <div>No author data received...</div>;
  }

  const authors = authorsQuery.data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
