import { useQuery } from "@apollo/client";
import queries from "./queries";
import { useState } from "react";

const Books = (props) => {
  const [chosenGenre, setChosenGenre] = useState("patterns");
  const booksQuery = useQuery(queries.GET_BOOKS_BY_GENRE, {
    variables: { genre: chosenGenre },
  });

  if (!props.show) {
    return null;
  }

  if (!booksQuery.data || !booksQuery.data.allBooks) {
    return <div>book data not found...</div>;
  }

  let books = booksQuery.data.allBooks;

  let allGenres = books.reduce((genres, book) => {
    book.genres.forEach((genre) => genres.add(genre));
    return genres;
  }, new Set());
  allGenres = Array.from(allGenres);

  if (chosenGenre) {
    books = books.filter((book) => book.genres.includes(chosenGenre));
  }

  const GenreSelectionBar = () => {
    console;
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
