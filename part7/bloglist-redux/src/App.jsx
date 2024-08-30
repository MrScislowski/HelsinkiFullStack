import { useState, useEffect } from "react";
import blogService from "./services/blogs";

import NewBlogForm from "./components/NewBlogForm";
import UserInfo from "./components/UserInfo";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogList from "./components/BlogList";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./reducers/user";

const App = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const savedLogin = localStorage.getItem("loggedInBloglistUser");
    if (savedLogin) {
      const savedUser = JSON.parse(savedLogin);
      dispatch(setUser(savedUser));
      blogService.setToken(savedUser.token);
    }
  }, []);

  return (
    <>
      <Notification />
      {user && (
        <>
          <UserInfo />
          <NewBlogForm />
          <BlogList />
        </>
      )}
      {!user && (
        <>
          <LoginForm setUser={setUser} />
        </>
      )}
    </>
  );
};

export default App;
