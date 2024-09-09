import { useState } from "react";
import mutations from "./mutations";
import { useMutation } from "@apollo/client";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation, loginResponse] = useMutation(mutations.LOGIN);

  const handleLogin = () => {
    event.preventDefault();
    loginMutation({ variables: { username, password } })
      .then((response) => {
        alert(`Got successful response: ${JSON.stringify(response, null, 2)}`);
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
