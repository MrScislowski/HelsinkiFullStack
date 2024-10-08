import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBlogs } from "../reducers/blogs";
import Blog from "./Blog";

const BlogList = () => {
  const blogs = useSelector((state) => {
    return [...state.blogs].sort((b1, b2) => b2.likes - b1.likes);
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBlogs())
  }, []);

  return (
    <div id="blog-list" data-testid="blog-list">
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
