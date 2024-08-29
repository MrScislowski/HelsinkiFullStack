import { useState } from "react";
import blogService from "../services/blogs";
import { useDispatch } from "react-redux";
import {
  showInfoNotification,
  showErrorNotification,
} from "../reducers/notification";

import PropTypes from "prop-types";

const blogStyle = {
  borderTopStyle: "solid",
  borderTopWidth: 1,
  padding: 5,
};

const Blog = ({ blog, blogs, setBlogs }) => {
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();

  const toggleButton = () => {
    return (
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "hide" : "show"}
      </button>
    );
  };

  const handleLike = async () => {
    const amendedBlog = await blogService.putAmended({
      ...blog,
      likes: blog.likes + 1,
    });
    setBlogs(
      blogs
        .map((b) => {
          if (b.id !== amendedBlog.id) {
            return b;
          } else {
            return {
              ...amendedBlog,
              user: b.user,
            };
          }
        })
        .sort((b1, b2) => b2.likes - b1.likes)
    );
    dispatch(showInfoNotification(`"${blog.title}" liked`));
  };

  const likeButton = () => <button onClick={handleLike}>like</button>;

  const handleRemove = async () => {
    if (window.confirm(`Delete "${blog.title}" by ${blog.author}?`)) {
      try {
        const response = await blogService.deleteBlog(blog);
        dispatch(showInfoNotification(`"${blog.title}" removed`));
        setBlogs(blogs.filter((b) => b.id !== blog.id));
      } catch (e) {
        const message = e?.response?.data?.error;
        dispatch(showErrorNotification(message || "could not remove blog"));
      }
    }
  };

  const removeButton = () => <button onClick={handleRemove}>remove</button>;

  const currentUserName = JSON.parse(
    localStorage.getItem("loggedInBloglistUser")
  )?.name;

  const details = () => (
    <div data-testid="blog-details">
      <ul>
        <li data-testid="blog-url">{blog.url}</li>
        <li data-testid="blog-likes">
          {" "}
          likes: {blog.likes} {likeButton()}
        </li>
        <li data-testid="blog-user"> {blog.user.name} </li>
      </ul>
      {blog.user.name === currentUserName && removeButton()}
    </div>
  );

  return (
    <article data-testid="blog-item" style={blogStyle}>
      <p data-testid="blog-summary">
        {blog.title} {blog.author} {toggleButton()}{" "}
      </p>
      {showDetails && details()}
    </article>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,

  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,

  setBlogs: PropTypes.func.isRequired,
};

export default Blog;
