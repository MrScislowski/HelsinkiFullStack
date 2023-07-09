import { useQuery } from "@apollo/client";
import { ALL_BOOKS, BOOKS_BY_GENRE } from "../queries";
import BookTable from "./BookTable";
import { useState } from "react";

const Books = (props) => {
  const [chosenGenre, setChosenGenre] = useState(null);

  const allBooksResponse = useQuery(ALL_BOOKS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const filteredBookResponse = useQuery(
    chosenGenre ? BOOKS_BY_GENRE : ALL_BOOKS,
    {
      variables: chosenGenre ? { genre: chosenGenre } : null,
    }
  );

  if (!props.show) {
    return null;
  }

  if (filteredBookResponse.loading || allBooksResponse.loading) {
    return <div>loading...</div>;
  }

  const allBooks = allBooksResponse.data.allBooks;
  const books = filteredBookResponse.data.allBooks;

  const allGenresSet = allBooks.reduce((genreSet, curBook) => {
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
