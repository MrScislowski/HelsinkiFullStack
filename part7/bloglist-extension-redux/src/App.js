import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import AddBlogForm from "./components/AddBlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import {
  clearNotification,
  displayErrorNotification,
  displayInfoNotification,
} from "./reducers/notificationReducer";

import { blogActions, blogDispatches } from "./reducers/blogReducer";

import { useSelector, useDispatch } from 'react-redux'


const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blogs)

  const newBlogFormRef = useRef();
  
  useEffect(() => {
    dispatch(blogDispatches.initializeBlogs())
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
    dispatch(blogActions.addBlog(newBlog));
    // setBlogs(blogs.concat(newBlog));
    newBlogFormRef.current.toggleVisibility();
    dispatch(
      displayInfoNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )
    );
  };

  const updateBlog = async (updatedBlogObject) => {
    const updatedBlog = await blogService.amendBlog(updatedBlogObject);
    dispatch(blogActions.updateBlog(updatedBlog))
    dispatch(
      displayInfoNotification(
        `blog "${updatedBlog.title}" by ${updatedBlog.author} updated`
      )
    );
  };

  const deleteBlog = async (blogObject) => {
    const confirmed = window.confirm(
      `Remove blog ${blogObject.title} by ${blogObject.author}?`
    );

    if (!confirmed) {
      return;
    }

    const response = await blogService.deleteBlog(blogObject);
    dispatch(blogActions.deleteBlog(blogObject))

    dispatch(
      displayInfoNotification(
        `blog "${blogObject.title}" by ${blogObject.author} removed`
      )
    );
  };

  const Notification = (props) => {
    const curNotification = notification

    if (curNotification.type === null) {
      return <></>;
    }

    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);

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
          {blogsDisplay()}
        </>
      )}
    </div>
  );
};

export default App;
