import { useLazyQuery, useQuery } from "@apollo/client";
import queries from "./queries";
import { useState, useEffect } from "react";

const Books = (props) => {
  const [chosenGenre, setChosenGenre] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [getAllBooks] = useLazyQuery(queries.GET_ALL_BOOKS);
  const booksQuery = useQuery(
    chosenGenre === null ? queries.GET_ALL_BOOKS : queries.GET_BOOKS_BY_GENRE,
    {
      variables: { genre: chosenGenre },
    }
  );

  // Get all the books once, on page load, to populate the genres
  useEffect(() => {
    getAllBooks().then((response) => setAllBooks(response.data.allBooks));
  }, [getAllBooks]);

  let allGenres = allBooks.reduce((genres, book) => {
    book.genres.forEach((genre) => genres.add(genre));
    return genres;
  }, new Set());
  allGenres = Array.from(allGenres);

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

  if (!props.show) {
    return null;
  }

  if (!booksQuery.data || !booksQuery.data.allBooks) {
    return <div>book data not found...</div>;
  }

  let books = booksQuery.data.allBooks;

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
