import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../reducers/userReducer";

const LoginStatusDisplay = (props) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const clearLoginInfo = () => {
    window.localStorage.removeItem("blogUserLogin");
    dispatch(userActions.setUser(null));
  };

  return (
    <>
      <p>{user.name} logged in</p>
      <p>
        <button onClick={clearLoginInfo}> logout </button>
      </p>
    </>
  );
};

export default LoginStatusDisplay;
