import { useQuery } from "@apollo/client";
import queries from "./queries";

const Books = (props) => {
  const booksQuery = useQuery(queries.GET_ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (!booksQuery.data || !booksQuery.data.allBooks) {
    return <div>book data not found...</div>;
  }

  const books = booksQuery.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
