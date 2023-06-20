import LoginStatusDisplay from "./LoginStatusDisplay";
import AddBlogForm from "./AddBlogForm";
import BlogList from "./BlogList";
import ClearDBButton from "./ClearDBButton";
import LoadInitialBlogsButton from "./LoadInitialBlogsButton";

const BlogsDisplay = (props) => (
  <>
    <LoginStatusDisplay />
    <AddBlogForm />
    <BlogList />
    <ClearDBButton />
    <LoadInitialBlogsButton />
  </>
);

export default BlogsDisplay;