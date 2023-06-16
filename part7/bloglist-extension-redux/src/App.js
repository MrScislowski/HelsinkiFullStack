import {useEffect, useRef } from "react";
import AddBlogForm from "./components/AddBlogForm";
import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import LoginStatusDisplay from "./components/LoginStatusDisplay";
import blogService from "./services/blogs";
import { userActions } from "./reducers/userReducer";

import { blogDispatches } from "./reducers/blogReducer";

import { useSelector, useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  // blog creation stuff
  const newBlogFormRef = useRef();

  useEffect(() => {
    dispatch(blogDispatches.initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loginDetailsJSON = window.localStorage.getItem("blogUserLogin");
    if (loginDetailsJSON) {
      const loginDetails = JSON.parse(loginDetailsJSON);
      dispatch(userActions.setUser(loginDetails));
      blogService.setToken(loginDetails.token);
    }
  }, [dispatch]);

  return (
    <div>
      <Notification />
      {user == null ? (
        <LoginForm />
      ) : (
        <>
          <LoginStatusDisplay />
          <AddBlogForm newBlogFormRef={newBlogFormRef} />
          <BlogList blogs={blogs} user={user} />
        </>
      )}
    </div>
  );
};

export default App;
