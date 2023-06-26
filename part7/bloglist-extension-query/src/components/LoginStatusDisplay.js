import { useContext } from "react";
import UserContext from "../reducers/UserContext";
import { Button, Text } from "@mantine/core"

const LoginStatusDisplay = (props) => {
  const [user, userActions] = useContext(UserContext);

  const clearLoginInfo = () => {
    window.localStorage.removeItem("blogUserLogin");
    userActions.setUser(null);
  };

  if (!user.user) {
    return <></>
  }

  return (
    <>
      <Text>{user.user.name} logged in</Text>
        <Button size="xs" variant="light" uppercase compact onClick={clearLoginInfo}> logout </Button>
    </>
  );
};

export default LoginStatusDisplay;
