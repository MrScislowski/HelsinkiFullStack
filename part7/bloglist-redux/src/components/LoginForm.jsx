import { useDispatch } from "react-redux";
import { showErrorNotification } from "../reducers/notification";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { useState } from "react";

const LoginForm = ({ setUser }) => {
  const dispatch = useDispatch();

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
      dispatch(showErrorNotification(e.message || "login failed...", details));
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
