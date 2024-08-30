import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "../reducers/user";

const UserInfo = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("loggedInBloglistUser");
    dispatch(clearUser());
  };

  return (
    <p>
      Logged in as: {user.name} <button onClick={handleLogout}>Log out</button>
    </p>
  );
};

export default UserInfo;
