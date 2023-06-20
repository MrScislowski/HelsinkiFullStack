import { useContext } from "react";
import UserContext from "../reducers/UserContext";

const LoginStatusDisplay = (props) => {
  const [user, userActions] = useContext(UserContext);

  const clearLoginInfo = () => {
    window.localStorage.removeItem("blogUserLogin");
    userActions.setUser(null);
  };

  return (
    <>
      <p>{user.user.name} logged in</p>
      <p>
        <button onClick={clearLoginInfo}> logout </button>
      </p>
    </>
  );
};

export default LoginStatusDisplay;
