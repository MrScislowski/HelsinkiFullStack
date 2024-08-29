import { useState, useEffect } from "react";
import blogService from "./services/blogs";

import NewBlogForm from "./components/NewBlogForm";
import UserInfo from "./components/UserInfo";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogList from "./components/BlogList";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

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
      {user && (
        <>
          <UserInfo user={user} setUser={setUser} />
          <NewBlogForm blogs={blogs} setBlogs={setBlogs} />
          <BlogList blogs={blogs} setBlogs={setBlogs} />
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
