import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import BookTable from "./BookTable";
import { useState } from "react";

const Books = (props) => {
  const response = useQuery(ALL_BOOKS);

  const [chosenGenre, setChosenGenre] = useState(null);

  if (!props.show) {
    return null;
  }

  if (response.loading) {
    return <div>loading...</div>;
  }

  const allBooks = response.data.allBooks;
  let books = allBooks;
  if (chosenGenre) {
    books = allBooks.filter((book) => book.genres.includes(chosenGenre));
  }

  const allGenresSet = books.reduce((genreSet, curBook) => {
    curBook.genres.forEach((genre) => genreSet.add(genre));
    return genreSet;
  }, new Set());
  const allGenres = Array.from(allGenresSet);

  return (
    <div>
      <h2>books</h2>
      {chosenGenre ? (
        <p>
          in genre <strong>{chosenGenre}</strong>
        </p>
      ) : null}
      <BookTable books={books} />
      {allGenres.map((genre) => (
        <button key={`${genre}button`} onClick={() => setChosenGenre(genre)}>
          {genre}
        </button>
      ))}
      <button key={`allgenrebuttonconst`} onClick={() => setChosenGenre(null)}>
        all genres
      </button>
    </div>
  );
};

export default Books;
