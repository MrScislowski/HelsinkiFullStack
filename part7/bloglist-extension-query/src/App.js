import { useEffect, useContext, useState } from "react";
import UserContext from "./reducers/UserContext";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import LoginStatusDisplay from "./components/LoginStatusDisplay";
import BlogsDisplay from "./components/BlogsDisplay";
import UsersDisplay from "./components/UsersDisplay";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import userService from "./services/users";
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
    return <div>query loading...</div>;
  }

  if (pageLoading) {
    return <div> loading ... </div>;
  }

  if (usermatch && !blogUser) {
    return <div>user not found...</div>
  }

  if (blogmatch && !chosenBlog) {
    return <div>blog not found...</div>
  }

  console.log(`in App, blogQuery.isloading is: ${blogQuery.isLoading}`)
  console.log("and the value of blogs is")
  console.dir(blogs);
  return (
    <>
      <Notification />
      <LoginStatusDisplay />
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

  console.log("requireAuth gets the following props, and is about to return props.children");
  console.dir(props);
  return props.children;

};

export default App;
