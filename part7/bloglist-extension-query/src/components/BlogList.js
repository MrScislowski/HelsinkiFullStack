import Blog from "./Blog";
import blogService from "../services/blogs";
import { useQuery } from "react-query";

const BlogList = (props) => {
  const blogQuery = useQuery("blogs", () => blogService.getAll());

  if (blogQuery.isLoading) {
    return <div>query loading...</div>;
  }

  const blogs = blogQuery.data;

  const sortedBlogs = [...blogs];
  sortedBlogs.sort((a, b) => {
    if (a.likes > b.likes) {
      return 1;
    } else if (a.likes < b.likes) {
      return -1;
    } else {
      return 0;
    }
  });

  return (
    <>
      <h2>blogs</h2>
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default BlogList;
