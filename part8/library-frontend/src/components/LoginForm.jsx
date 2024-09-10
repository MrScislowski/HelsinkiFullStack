import { useState } from "react";
import mutations from "./mutations";
import { useApolloClient, useMutation } from "@apollo/client";
import config from "../config";

const LoginForm = ({ show, setUser, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation] = useMutation(mutations.LOGIN);
  const client = useApolloClient();

  if (!show) return null;

  const handleLogin = (event) => {
    event.preventDefault();
    loginMutation({ variables: { username, password } })
      .then((response) => {
        setUser(response.data.login.value);
        localStorage.setItem(config.COOKIE_NAME, response.data.login.value);
        client.resetStore();
        setUsername("");
        setPassword("");
        setPage("books");
      })
      .catch((error) => {
        let feedback = "Unsuccessful login\n";
        if (error.graphQLErrors) {
          error.graphQLErrors.forEach((gqlErr) => {
            feedback = feedback.concat(
              `${gqlErr.message}\n${gqlErr.extensions.error}`
            );
          });
        }
        alert(feedback);
      });
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Log in</button>
    </form>
  );
};

export default LoginForm;
