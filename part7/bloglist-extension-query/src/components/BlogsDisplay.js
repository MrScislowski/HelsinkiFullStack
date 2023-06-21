import AddBlogForm from "./AddBlogForm";
import BlogList from "./BlogList";
import ClearDBButton from "./ClearDBButton";
import LoadInitialBlogsButton from "./LoadInitialBlogsButton";

const BlogsDisplay = (props) => (
  <>
    <AddBlogForm />
    <BlogList />
    <ClearDBButton />
    <LoadInitialBlogsButton />
  </>
);

export default BlogsDisplay;