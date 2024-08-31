import UserInfo from "./UserInfo";
import NewBlogForm from "./NewBlogForm";
import BlogList from "./BlogList";

const LoggedInView = () => {
  return (
    <>
      <UserInfo />
      <NewBlogForm />
      <BlogList />
    </>
  );
};

export default LoggedInView;
