import { useEffect, useContext, useState } from "react";
import UserContext from "./reducers/UserContext";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import LoginStatusDisplay from "./components/LoginStatusDisplay";
import BlogsDisplay from "./components/BlogsDisplay";
import UsersDisplay from "./components/UsersDisplay";
import blogService from "./services/blogs";
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";

const App = () => {
  const [user, userActions] = useContext(UserContext);
  const [pageLoading, setPageLoading] = useState(true);


  useEffect( () => {
    const loginDetailsJSON = window.localStorage.getItem("blogUserLogin");
    if (user.user == null && loginDetailsJSON) {
      const loginDetails = JSON.parse(loginDetailsJSON);
      userActions.setUser(loginDetails);
      blogService.setToken(loginDetails.token);
    }
    setPageLoading(false);
  }, [user])

  // https://github.com/remix-run/react-router/blob/dev/examples/auth/src/App.tsx

  if (pageLoading) {
    return (
      <div> loading ... </div>
    )
  }

  return (
    <Router>
      <Notification />
      <LoginStatusDisplay />
      <Routes>
          <Route path="/blogs" element={<RequireAuth><BlogsDisplay /></RequireAuth>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/users" element={<RequireAuth><UsersDisplay /></RequireAuth>} />
          <Route path="/" element={<RequireAuth><BlogsDisplay /></RequireAuth>} />
      </Routes>
    </Router>
  );
};

const RequireAuth = (props) => {
  const [user, userActions] = useContext(UserContext);
  
  console.log('rendering in RequireAuth')
  console.dir(user);
  if (user.user == null) {
    return <Navigate to="/login" replace />
  }

  return props.children;
}

export default App;
