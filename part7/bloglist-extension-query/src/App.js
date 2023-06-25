import { useEffect, useContext, useState } from "react";
import UserContext from "./reducers/UserContext";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogsDisplay from "./components/BlogsDisplay";
import UsersDisplay from "./components/UsersDisplay";
import NavigationMenu from "./components/NavigationMenu";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import userService from "./services/users";
import { Alert, Loader } from "@mantine/core";
import { useQuery } from "react-query";
import { useMatch, Navigate, Routes, Route } from "react-router-dom";
import IndividualUser from "./components/IndividualUser";

const App = () => {
  const [user, userActions] = useContext(UserContext);

  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const loginDetailsJSON = window.localStorage.getItem("blogUserLogin");
    if (user.user == null && loginDetailsJSON) {
      const loginDetails = JSON.parse(loginDetailsJSON);
      userActions.setUser(loginDetails);
      blogService.setToken(loginDetails.token);
    }
    setPageLoading(false);
  }, [user]);

  const [allUsersData, setAllUsersData] = useState([]);
  useEffect(() => {
    const getAllUsersData = async () => {
      const theData = await userService.getAll();
      setAllUsersData(theData);
    };

    getAllUsersData();
  }, []);

  const blogQuery = useQuery("blogs", () => blogService.getAll());

  const blogs = blogQuery.data;

  const usermatch = useMatch("/users/:id");
  const blogUser = usermatch
    ? allUsersData.find((user) => user.id === usermatch.params.id)
    : null;

  const blogmatch = useMatch("/blogs/:id");
  const chosenBlog = (blogmatch && blogs)
    ? blogs.find((blog) => blog.id === blogmatch.params.id)
    : null;

  if (blogQuery.isLoading) {
    return <Loader variant="dots" />
  }

  if (pageLoading) {
    return <Loader variant="dots" />;
  }

  if (usermatch && !blogUser) {
    return <Alert> User not found </Alert>
  }

  if (blogmatch && !chosenBlog) {
    return <Alert> Blog not found </Alert>
  }

  return (
    <>
      <Notification />
      <RequireAuth>
        <NavigationMenu />
      </RequireAuth>
      <Routes>
        <Route
          path="/blogs"
          element={
            <RequireAuth>
              <BlogsDisplay blogs={blogs}/>
            </RequireAuth>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <RequireAuth>
              <Blog blog={chosenBlog} />
            </RequireAuth>
          }
        />
        <Route
          path="/users/:id"
          element={
            <RequireAuth>
              <IndividualUser user={blogUser} />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/users"
          element={
            <RequireAuth>
              <UsersDisplay allUsersData={allUsersData} />
            </RequireAuth>
          }
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <BlogsDisplay blogs={blogs}/>
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
};

const RequireAuth = (props) => {
  const [user, userActions] = useContext(UserContext);

  if (user.user == null) {
    return <Navigate to="/login" replace />;
  }

  return props.children;

};

export default App;
