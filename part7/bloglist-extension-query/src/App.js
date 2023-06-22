import { useEffect, useContext, useState } from "react";
import UserContext from "./reducers/UserContext";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import LoginStatusDisplay from "./components/LoginStatusDisplay";
import BlogsDisplay from "./components/BlogsDisplay";
import UsersDisplay from "./components/UsersDisplay";
import blogService from "./services/blogs";
import userService from "./services/users";
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

  let match = useMatch("/users/:id");
  const blogUser = match
    ? allUsersData.find((user) => user.id === match.params.id)
    : null;


  if (pageLoading) {
    return <div> loading ... </div>;
  }

  

  return (
    <>
      <Notification />
      <LoginStatusDisplay />
      <Routes>
        <Route
          path="/blogs"
          element={
            <RequireAuth>
              <BlogsDisplay />
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
              <UsersDisplay allUsersData={allUsersData}/>
            </RequireAuth>
          }
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <BlogsDisplay />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
};

const RequireAuth = (props) => {
  const [user, userActions] = useContext(UserContext);

  console.log("rendering in RequireAuth");
  console.dir(user);
  if (user.user == null) {
    return <Navigate to="/login" replace />;
  }

  return props.children;
};

export default App;
