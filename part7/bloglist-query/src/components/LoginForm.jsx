import { useState } from "react";
import loginService from "../services/login";
import blogService from "../services/blogs";

const LoginForm = ({ setNotification, setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.attemptLogin(username, password);
      localStorage.setItem("loggedInBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (e) {
      const details = e.response ? e.response.data : null;
      setNotification({ message: e.message, type: "error", data: details });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">username:</label>
        <input
          type="text"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">log in</button>
      </form>
    </>
  );
};

export default LoginForm;
