import { useState, useContext } from "react";
import { userActions } from "../reducers/userReducer";
import NotificationContext from "../reducers/NotificationContext";
import { useDispatch } from "react-redux";

const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const [notification, notificationDispatch] = useContext(NotificationContext);
  notificationDispatch()

  const handleLogin = async (event) => {
    event.preventDefault();
    const didLogin = await dispatch(userActions.attemptLogin(username, password));
    if (didLogin) {
      setUsername("");
      setPassword("");
    } else {
      // dispatch(
      //   notificationDispatch.displayTimedErrorNotification(
      //     "wrong username or password"
      //   )
      // );
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