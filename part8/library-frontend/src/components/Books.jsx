import { useLazyQuery, useQuery } from "@apollo/client";
import queries from "./queries";
import { useState, useEffect } from "react";

const Books = (props) => {
  const [chosenGenre, setChosenGenre] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const getAllBooksQuery = useQuery(queries.GET_ALL_BOOKS);
  const [filteredBooksQuery, filteredBooksResponse] = useLazyQuery(
    queries.GET_BOOKS_BY_GENRE
  );

  // update the filtered book results whenever ALL_BOOKS query updates
  useEffect(() => {
    console.log("re-running the books effect");
    chosenGenre &&
      filteredBooksQuery({ variables: { genre: chosenGenre } }).then((res) =>
        setFilteredBooks(res.data.allBooks)
      );
  }, [getAllBooksQuery.data, filteredBooksQuery, chosenGenre]);

  if (!props.show) {
    return null;
  }

  if (!getAllBooksQuery.data) return <p>no book data returned</p>;

  const allBooks = getAllBooksQuery.data.allBooks;

  let allGenres = allBooks.reduce((genres, book) => {
    book.genres.forEach((genre) => genres.add(genre));
    return genres;
  }, new Set());
  allGenres = Array.from(allGenres);

  if (
    chosenGenre &&
    (!filteredBooksResponse.data || !filteredBooksResponse.data.allBooks)
  ) {
    return <p>book data not found...</p>;
  }

  let books = chosenGenre ? filteredBooks : allBooks;

  const GenreSelectionBar = () => {
    return (
      <div style={{ display: "flex" }}>
        {allGenres.map((genre) => {
          return (
            <button key={genre} onClick={() => setChosenGenre(genre)}>
              {genre}
            </button>
          );
        })}
        <button onClick={() => setChosenGenre(null)}>all genres</button>
      </div>
    );
  };

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
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <GenreSelectionBar />
    </div>
  );
};

export default Books;
