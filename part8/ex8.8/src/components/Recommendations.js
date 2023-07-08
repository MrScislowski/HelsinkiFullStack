import { useQuery } from "@apollo/client";
import { BOOKS_BY_GENRE } from "../queries";
import BookTable from "./BookTable";
import { useEffect, useState } from "react";

const Recommendations = ({ show, favoriteGenre }) => {
  const response = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
  });

  if (!show) {
    return null;
  }

  if (response.loading) {
    return <div>loading...</div>;
  }

  const books = response.data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        in your favorite genre <strong>{favoriteGenre}</strong>
      </p>
      <BookTable books={books} />
    </div>
  );
};

export default Recommendations;
