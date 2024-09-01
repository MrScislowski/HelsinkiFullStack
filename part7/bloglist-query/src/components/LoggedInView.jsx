import UserInfo from "./UserInfo";
import NewBlogForm from "./NewBlogForm";
import BlogList from "./BlogList";
import UserList from "./UserList";
import { Route, Routes, Link } from "react-router-dom";
import User from "./User";

const LoggedInView = () => {
  return (
    <>
      <UserInfo />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to="/">blogs</Link>
        <Link to="/users">users</Link>
      </div>

      <Routes>
        <Route path="/users/:id" element={<User />} />
        <Route
          path="/"
          element={
            <>
              <NewBlogForm /> <BlogList />
            </>
          }
        />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </>
  );
};

export default LoggedInView;
