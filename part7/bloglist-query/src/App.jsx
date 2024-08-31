import { useEffect } from "react";
import blogService from "./services/blogs";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import LoggedInView from "./components/LoggedInView";
import { useUser, useUserDispatch, setUser } from "./UserContext";

const App = () => {
  const user = useUser();
  const userDispatch = useUserDispatch();

  useEffect(() => {
    const savedLogin = localStorage.getItem("loggedInBloglistUser");
    if (savedLogin) {
      const savedUser = JSON.parse(savedLogin);
      userDispatch(setUser(savedUser));
      blogService.setToken(savedUser.token);
    }
  }, []);

  return (
    <>
      <Notification />
      {user ? <LoggedInView /> : <LoginForm />}
    </>
  );
};

export default App;
