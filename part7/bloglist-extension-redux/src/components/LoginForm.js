import { useState } from "react";
import { userActions } from "../reducers/userReducer";
import { notificationDispatch } from "../reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";

const LoginForm = (props) => {
  const user = useSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      dispatch(userActions.attemptLogin(username, password));
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(
        notificationDispatch.displayTimedErrorNotification(
          "wrong username or password"
        )
      );
    }
  };

  return (
    <>
      <h2> log in to application</h2>
      <form onSubmit={handleLogin}>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <button type="submit"> login </button>
      </form>
    </>
  );
};

export default LoginForm;