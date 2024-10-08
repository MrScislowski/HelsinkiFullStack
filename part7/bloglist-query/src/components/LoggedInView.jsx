import UserInfo from "./UserInfo";
import NewBlogForm from "./NewBlogForm";
import BlogList from "./BlogList";
import BlogDetails from "./BlogDetails";
import UserList from "./UserList";
import NavigationMenu from "./NavigationMenu";
import { Route, Routes, Link } from "react-router-dom";
import User from "./User";

const LoggedInView = () => {
  return (
    <>
      <NavigationMenu />
      <div className="container mx-4 py-4">
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
      </div>
    </>
  );
};

export default LoggedInView;
