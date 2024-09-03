import UserInfo from "./UserInfo";
import NewBlogForm from "./NewBlogForm";
import BlogList from "./BlogList";
import BlogDetails from "./BlogDetails";
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
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route
          path="/"
          element={
            <>
              <NewBlogForm /> <BlogList />
            </>
          }
        />
      </Routes>
    </>
  );
};

export default LoggedInView;
