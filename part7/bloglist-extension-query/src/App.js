import {useEffect} from "react";
import AddBlogForm from "./components/AddBlogForm";
import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import LoginStatusDisplay from "./components/LoginStatusDisplay";
import blogService from "./services/blogs";
import { userActions } from "./reducers/userReducer";
import { useSelector, useDispatch } from "react-redux";


const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

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
          <AddBlogForm />
          <BlogList />
        </>
      )}
    </div>
  );
};

export default App;
