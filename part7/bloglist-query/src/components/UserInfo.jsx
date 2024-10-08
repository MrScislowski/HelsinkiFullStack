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
      <span>👤</span>
      <span className="text-xs">{user.name}</span>
      <button
        className="rounded-lg px-2 py-2 text-red-400 hover:bg-red-200"
        onClick={handleLogout}
      >
        Log out
      </button>
    </>
  );
};

export default UserInfo;
