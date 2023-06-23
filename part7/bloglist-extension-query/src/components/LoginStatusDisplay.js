import { useContext } from "react";
import UserContext from "../reducers/UserContext";

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
      {user.user.name} logged in
        <button onClick={clearLoginInfo}> logout </button>
    </>
  );
};

export default LoginStatusDisplay;
