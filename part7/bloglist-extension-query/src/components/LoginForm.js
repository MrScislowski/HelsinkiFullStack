import { useState, useContext } from "react";
import { NotificationContext } from "../reducers/NotificationContext";
import { UserContext } from "../reducers/UserContext";

const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const notification = useContext(NotificationContext);
  const user = useContext(UserContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    const didLogin = await user.attemptLogin(username, password);
    if (didLogin) {
      setUsername("");
      setPassword("");
    } else {
        notification.displayTimedErrorMessage("wrong username or password");
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