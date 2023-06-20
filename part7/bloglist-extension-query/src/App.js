import { useEffect, useContext } from "react";
import UserContext from "./reducers/UserContext";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogsDisplay from "./components/BlogsDisplay";
import blogService from "./services/blogs";
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";

const App = () => {
  const [user, userActions] = useContext(UserContext);

  useEffect(() => {
    const loginDetailsJSON = window.localStorage.getItem("blogUserLogin");
    if (loginDetailsJSON) {
      const loginDetails = JSON.parse(loginDetailsJSON);
      userActions.setUser(loginDetails);
      blogService.setToken(loginDetails.token);
    }
  }, []); // TODO: probably when a different user logs in this should happen again... so what should I put in the dependency array?


  // https://github.com/remix-run/react-router/blob/dev/examples/auth/src/App.tsx
  return (
    <Router>
      <Notification />
      <Routes>
        <Route path="/blogs" element={<RequireAuth><BlogsDisplay /></RequireAuth>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<RequireAuth><BlogsDisplay /></RequireAuth>} />
      </Routes>
    </Router>
  );
};

const RequireAuth = (props) => {
  const [user, userActions] = useContext(UserContext);
  if (user.user == null) {
    return <Navigate to="/login" replace />
  }

  return props.children;
}

export default App;
