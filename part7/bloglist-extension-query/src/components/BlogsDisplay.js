import AddBlogForm from "./AddBlogForm";
import BlogList from "./BlogList";
import ClearDBButton from "./ClearDBButton";
import LoadInitialBlogsButton from "./LoadInitialBlogsButton";

const BlogsDisplay = ({blogs}) => {
  return (
  <>
    <AddBlogForm />
    <BlogList blogs={blogs} />
    <ClearDBButton />
    <LoadInitialBlogsButton />
  </>
);
  }

export default BlogsDisplay;