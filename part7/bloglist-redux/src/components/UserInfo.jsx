const UserInfo = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("loggedInBloglistUser");
    setUser(null);
  };

  return (
    <p>
      Logged in as: {user.name} <button onClick={handleLogout}>Log out</button>
    </p>
  );
};

export default UserInfo;
