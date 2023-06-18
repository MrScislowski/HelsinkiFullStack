import {useEffect, useContext} from "react";
import UserContext from "./reducers/UserContext";
import AddBlogForm from "./components/AddBlogForm";
import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import LoginStatusDisplay from "./components/LoginStatusDisplay";
import blogService from "./services/blogs";

import { useSelector, useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const userActions = useContext(UserContext);
  
  useEffect(() => {
    const loginDetailsJSON = window.localStorage.getItem("blogUserLogin");
    if (loginDetailsJSON) {
      const loginDetails = JSON.parse(loginDetailsJSON);
      userActions.setUser(loginDetails);
      // dispatch(userActions.setUser(loginDetails));
      blogService.setToken(loginDetails.token);
    }
  }, [dispatch]);

  return (
    <div>
      <Notification />
      {userActions.user.user == null ? (
        <LoginForm />
      ) : (
        <>
          <LoginStatusDisplay />
          <AddBlogForm />
          <BlogList />
        </>
      )}
    </div>
  );
};

export default App;
