import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import EditAuthor from "./components/EditAuthor";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";
import { useApolloClient, useSubscription } from "@apollo/client";
import jwtDecode from "jwt-decode";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(JSON.stringify(data.data));
      const title = data.data.bookAdded.title;
      const author = data.data.bookAdded.author.name;
      window.alert(`${title} by ${author} added`);
      const addedBook = data.data.bookAdded;

      // {"bookAdded":{"title":"bahhjahh","author":{"name":"bahhjahh","__typename":"Author"},"published":"2342","genres":["df","wdf"],"__typename":"Book"}}

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        if (
          allBooks.find(
            (book) =>
              book.author.name === addedBook.author.name &&
              book.title === addedBook.title
          )
        ) {
          return { allBooks: allBooks };
        } else {
          return { allBooks: allBooks.concat(addedBook) };
        }
      });
    },
  });

  const logout = () => {
    setToken(null);
    window.localStorage.clear();
    client.resetStore();
  };

  let favoriteGenre = null;
  if (token) {
    try {
      favoriteGenre = jwtDecode(token).favoriteGenre;
    } catch (error) {
      console.log(`error parsing genre from token. Error: ${error}`);
    }
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? null : (
          <button onClick={() => setPage("login")}>log in</button>
        )}
        {token ? (
          <button onClick={() => setPage("add")}>add book</button>
        ) : null}
        {token ? (
          <button onClick={() => setPage("editAuthor")}>
            edit author details
          </button>
        ) : null}
        {token ? (
          <button onClick={() => setPage("recommendations")}>
            recommendations
          </button>
        ) : null}
        {token ? <button onClick={() => logout()}>logout</button> : null}
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <EditAuthor show={page === "editAuthor"} />

      <Recommendations
        show={page === "recommendations"}
        favoriteGenre={favoriteGenre}
      />

      <LoginForm show={page === "login"} setToken={setToken} />
    </div>
  );
};

export default App;
