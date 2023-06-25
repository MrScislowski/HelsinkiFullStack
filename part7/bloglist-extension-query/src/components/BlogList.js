import { Link } from "react-router-dom";

const BlogList = (props) => {
  const { blogs } = props;

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
      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default BlogList;
