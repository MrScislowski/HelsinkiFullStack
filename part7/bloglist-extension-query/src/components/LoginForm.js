import { useState, useContext } from "react";
import { NotificationContext } from "../reducers/NotificationContext";
import { UserContext } from "../reducers/UserContext";
import { useNavigate } from "react-router-dom";
import { Button, PasswordInput, TextInput, Title } from "@mantine/core";

const LoginForm = (props) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const notification = useContext(NotificationContext);
  const [user, userActions] = useContext(UserContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    const didLogin = await userActions.attemptLogin(username, password);
    if (didLogin) {
      setUsername("");
      setPassword("");
      navigate("/");
    } else {
      notification.displayTimedErrorMessage("wrong username or password");
    }
  };

  return (
    <>
      <Title order={2}> log in to application</Title>
      <form onSubmit={handleLogin}>
        <TextInput
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <PasswordInput
          label="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button type="submit"> login </Button>
      </form>
    </>
  );
};

export default LoginForm;
