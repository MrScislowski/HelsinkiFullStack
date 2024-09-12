import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";
import queries from "./components/queries";
import { useApolloClient, useSubscription } from "@apollo/client";
import config from "./config";

const App = () => {
  const [page, setPage] = useState("authors");
  const [user, setUser] = useState(null);
  const client = useApolloClient();
  useSubscription(queries.BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      alert(`Added book ${JSON.stringify(addedBook, null, 2)}`);
    },
  });

  useEffect(() => {
    const userCookie = localStorage.getItem(config.COOKIE_NAME);
    if (userCookie) {
      setUser(userCookie);
    }
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {user && <button onClick={() => setPage("add")}>add book</button>}
        {user && (
          <button onClick={() => setPage("recommend")}>recommend</button>
        )}
        {user ? (
          <button
            onClick={() => {
              setUser(null);
              setPage("books");
              localStorage.removeItem(config.COOKIE_NAME);
              client.resetStore();
            }}
          >
            logout
          </button>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} user={user} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommendations show={page === "recommend"} />

      <LoginForm show={page === "login"} setUser={setUser} setPage={setPage} />
    </div>
  );
};

export default App;
