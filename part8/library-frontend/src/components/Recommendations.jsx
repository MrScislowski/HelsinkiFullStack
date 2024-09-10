import { useQuery } from "@apollo/client";
import queries from "./queries";

const Recommendations = ({ show }) => {
  const favGenreQuery = useQuery(queries.GET_CURRENT_USER);
  const booksQuery = useQuery(queries.GET_ALL_BOOKS);

  if (!show) return null;

  if (!favGenreQuery.data || !booksQuery.data) return null;

  if (!favGenreQuery.data.me) return <p>No favorite genre data found</p>;

  const books = booksQuery.data.allBooks;
  console.dir(favGenreQuery.data);
  const favGenre = favGenreQuery.data.me.favoriteGenre;

  const filteredBooks = books.filter((book) => book.genres.includes(favGenre));

  return (
    <>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favGenre}</strong>
      </p>

      {filteredBooks.length === 0 ? (
        <p>No books in this genre</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th />
              <th>author</th>
              <th>published</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => {
              return (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.published}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Recommendations;
