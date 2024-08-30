import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import UserInfo from "./components/UserInfo";
import BlogList from "./components/BlogList";
import NewBlogForm from "./components/NewBlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((b1, b2) => b2.likes - b1.likes)));
  }, []);

  useEffect(() => {
    const savedLogin = localStorage.getItem("loggedInBloglistUser");
    if (savedLogin) {
      const savedUser = JSON.parse(savedLogin);
      setUser(savedUser);
      blogService.setToken(savedUser.token);
    }
  }, []);

  return (
    <>
      <Notification />
      {user ? (
        <>
          <UserInfo user={user} setUser={setUser} />
          <NewBlogForm />
          <BlogList />
        </>
      ) : (
        <LoginForm setUser={setUser} />
      )}
    </>
  );
};

export default App;
