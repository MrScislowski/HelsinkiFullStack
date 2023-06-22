import AddBlogForm from "./AddBlogForm";
import BlogList from "./BlogList";
import ClearDBButton from "./ClearDBButton";
import LoadInitialBlogsButton from "./LoadInitialBlogsButton";

const BlogsDisplay = ({blogs}) => {
  console.log("BlogDisplay got the following blogs: ");
  console.dir(blogs)
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