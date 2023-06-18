import { useContext } from "react";
import UserContext from "../reducers/UserContext";

const LoginStatusDisplay = (props) => {
  const user = useContext(UserContext);

  const clearLoginInfo = () => {
    window.localStorage.removeItem("blogUserLogin");
    user.setUser(null);
  };

  return (
    <>
      <p>{user.user.user.name} logged in</p>
      <p>
        <button onClick={clearLoginInfo}> logout </button>
      </p>
    </>
  );
};

export default LoginStatusDisplay;
