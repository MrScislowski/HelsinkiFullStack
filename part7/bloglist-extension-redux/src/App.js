import { useState, useEffect, useRef } from "react";
import AddBlogForm from "./components/AddBlogForm";
import BlogList from "./components/BlogList";
import blogService from "./services/blogs";
import loginService from "./services/login";
import {
  displayErrorNotification,
  displayInfoNotification,
} from "./reducers/notificationReducer";

import { blogActions, blogDispatches } from "./reducers/blogReducer";

import { useSelector, useDispatch } from "react-redux";

const App = () => {
  // login stuff
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // blog & notification state
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const blogs = useSelector((state) => state.blogs);

  // blog creation stuff
  const newBlogFormRef = useRef();

  useEffect(() => {
    dispatch(blogDispatches.initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loginDetailsJSON = window.localStorage.getItem("blogUserLogin");
    if (loginDetailsJSON) {
      const loginDetails = JSON.parse(loginDetailsJSON);
      setUser(loginDetails);
      blogService.setToken(loginDetails.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await loginService.attemptLogin({ username, password });
      blogService.setToken(response.token);
      setUser(response);
      window.localStorage.setItem("blogUserLogin", JSON.stringify(response));
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(displayErrorNotification("wrong username or password"));
    }
  };

  const loginForm = () => (
    <>
      <h2> log in to application</h2>
      <form onSubmit={handleLogin}>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <button type="submit"> login </button>
      </form>
    </>
  );

  const loginStatusDisplay = () => <p>{user.name} logged in</p>;

  const clearLoginInfo = () => {
    window.localStorage.removeItem("blogUserLogin");
    setUser(null);
  };

  const logoutButtonDisplay = () => (
    <p>
      <button onClick={clearLoginInfo}> logout </button>
    </p>
  );

  const addBlog = async (blogObject) => {
    const newBlog = await blogService.postBlog(blogObject);
    dispatch(blogActions.addBlog(newBlog));
    // setBlogs(blogs.concat(newBlog));
    newBlogFormRef.current.toggleVisibility();
    dispatch(
      displayInfoNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )
    );
  };

  const Notification = (props) => {
    const curNotification = notification;

    if (curNotification.type === null) {
      return <></>;
    }

    return (
      <>
        <p className={curNotification.type}>{curNotification.message}</p>
      </>
    );
  };

  return (
    <div>
      <Notification />
      {user === null ? (
        loginForm()
      ) : (
        <>
          {loginStatusDisplay()}
          {logoutButtonDisplay()}
          <AddBlogForm newBlogFormRef={newBlogFormRef} addBlog={addBlog} />
          <BlogList blogs={blogs} user={user} />
        </>
      )}
    </div>
  );
};

export default App;
