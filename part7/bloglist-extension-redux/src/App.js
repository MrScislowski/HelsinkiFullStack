import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import AddBlogForm from "./components/AddBlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import notificationReducer from "./reducers/notificationReducer";

import { createStore } from "redux";

const store = createStore(notificationReducer);

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  // const [notification, setNotification] = useState({
  //   type: null,
  //   message: null,
  // });

  const newBlogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

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
      store.dispatch({
        type: "SET_ERROR_MESSSAGE",
        payload: "wrong username or password",
      });
    }
  };

  const loginForm = () => (
    <>
      <h2> log in to application</h2>
      <form onSubmit={handleLogin}>
        username{" "}
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />{" "}
        <br />
        password{" "}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />{" "}
        <br />
        <button type="submit"> login </button>
      </form>
    </>
  );

  const blogsDisplay = () => {
    const sortedBlogs = [...blogs];
    sortedBlogs.sort((a, b) => {
      if (a.likes > b.likes) {
        return 1;
      } else if (a.likes < b.likes) {
        return -1;
      } else {
        return 0;
      }
    });

    return (
      <>
        <h2>blogs</h2>
        {sortedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={deleteBlog}
            user={user}
          />
        ))}
      </>
    );
  };

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
    setBlogs(blogs.concat(newBlog));
    newBlogFormRef.current.toggleVisibility();
    store.dispatch({
      type: "SET_INFO_MESSAGE",
      payload: `a new blog ${newBlog.title} by ${newBlog.author} added`,
    });
  };

  const updateBlog = async (updatedBlogObject) => {
    const updatedBlog = await blogService.amendBlog(updatedBlogObject);
    setBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
    store.dispatch({
      type: "SET_INFO_MESSAGE",
      payload: `blog "${updatedBlog.title}" by ${updatedBlog.author} liked`,
    });
  };

  const deleteBlog = async (blogObject) => {
    const confirmed = window.confirm(
      `Remove blog ${blogObject.title} by ${blogObject.author}?`
    );

    if (!confirmed) {
      return;
    }

    const response = await blogService.deleteBlog(blogObject);
    setBlogs(blogs.filter((b) => b.id !== response.id));

    store.dispatch({
      type: "SET_INFO_MESSAGE",
      payload: `blog "${blogObject.title}" by ${blogObject.author} removed`,
    });
  };

  const notificationDisplay = () => {
    const curNotification = store.getState();
    if (curNotification.type === null) {
      return <></>;
    }
    setTimeout(() => {
      store.dispatch({ type: "CLEAR" });
    }, 5000);
    return (
      <>
        <p className={curNotification.type}>{curNotification.message}</p>
      </>
    );
  };

  return (
    <div>
      {notificationDisplay()}
      {user === null ? (
        loginForm()
      ) : (
        <>
          {loginStatusDisplay()}
          {logoutButtonDisplay()}
          <AddBlogForm newBlogFormRef={newBlogFormRef} addBlog={addBlog} />
          {blogsDisplay()}
        </>
      )}
    </div>
  );
};

export default App;
