import { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import queries from "./queries";

const Recommendations = ({ show }) => {
  const favGenreQuery = useQuery(queries.GET_CURRENT_USER);
  const booksQuery = useQuery(queries.GET_ALL_BOOKS);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [favGenre, setFavGenre] = useState(null);
  const [filteredBooksQuery] = useLazyQuery(queries.GET_BOOKS_BY_GENRE, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    favGenreQuery.data?.me?.favoriteGenre &&
      setFavGenre(favGenreQuery.data.me.favoriteGenre);
  }, [favGenreQuery.data]);

  useEffect(() => {
    favGenre &&
      filteredBooksQuery({ variables: { genre: favGenre } }).then((res) => {
        setFilteredBooks(res.data.allBooks);
      });
  }, [favGenre, booksQuery.data, filteredBooksQuery]);

  if (!show) return null;

  if (!favGenreQuery.data || !booksQuery.data) return null;

  if (!favGenreQuery.data.me) return <p>No favorite genre data found</p>;

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
