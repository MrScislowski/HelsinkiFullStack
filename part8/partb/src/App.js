import { useApolloClient, useQuery } from "@apollo/client";
import { ALL_PERSONS } from "./queries";
import Persons from "./Persons";
import PersonForm from "./PersonForm";
import ChangeNumberForm from "./ChangeNumberForm";
import LoginForm from "./LoginForm";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const result = useQuery(ALL_PERSONS);

  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <div>
        <Notification errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={setErrorMessage} />
      </div>
    );
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <>
      <Notification errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setErrorMessage={setErrorMessage} />
      <ChangeNumberForm setErrorMessage={setErrorMessage} />
    </>
  );
}

const Notification = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: "red" }}>{errorMessage}</div>;
};

export default App;
