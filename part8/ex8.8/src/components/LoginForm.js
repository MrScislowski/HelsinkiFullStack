import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOGIN } from "../queries";

const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, loginData] = useMutation(LOGIN, {
    onError: (error) => {
      console.log("login error: ");
      console.dir(error);
    },
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    login({
      variables: { username, password },
    });
  };

  useEffect(() => {
    if (loginData.data) {
      const token = loginData.data.login.value;
      props.setToken(token);
      window.localStorage.setItem("booklisting-user-token", token);
    }
  }, [loginData.data]); // eslint-disable-line

  if (!props.show) {
    return null;
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default LoginForm;
