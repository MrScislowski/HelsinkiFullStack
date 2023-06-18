import {useEffect, useContext} from "react";
import UserContext from "./reducers/UserContext";
import AddBlogForm from "./components/AddBlogForm";
import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import LoginStatusDisplay from "./components/LoginStatusDisplay";
import blogService from "./services/blogs";

const App = () => {
  const userActions = useContext(UserContext);
  
  useEffect(() => {
    const loginDetailsJSON = window.localStorage.getItem("blogUserLogin");
    if (loginDetailsJSON) {
      const loginDetails = JSON.parse(loginDetailsJSON);
      userActions.setUser(loginDetails);
      blogService.setToken(loginDetails.token);
    }
  }, []); // TODO: probably when a different user logs in this should happen again... so what should I put in the dependency array?

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
