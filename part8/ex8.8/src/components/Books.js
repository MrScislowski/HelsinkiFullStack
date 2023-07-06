import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
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
    console.dir(curBook);
    curBook.genres.forEach((genre) => genreSet.add(genre));
    return genreSet;
  }, new Set());
  const allGenres = Array.from(allGenresSet);

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
