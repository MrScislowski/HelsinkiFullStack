import Blog from "./Blog";

const BlogList = ({ blogs, setBlogs }) => {
  return (
    <div id="blog-list" data-testid="blog-list">
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} />
      ))}
    </div>
  );
};

export default BlogList;
