import { useUser, useUserDispatch, clearUser } from "../UserContext";

const UserInfo = () => {
  const user = useUser();
  const userDispatch = useUserDispatch();

  const handleLogout = () => {
    localStorage.removeItem("loggedInBloglistUser");
    userDispatch(clearUser());
  };

  return (
    <>
      Logged in as: {user.name} <button onClick={handleLogout}>Log out</button>
    </>
  );
};

export default UserInfo;
