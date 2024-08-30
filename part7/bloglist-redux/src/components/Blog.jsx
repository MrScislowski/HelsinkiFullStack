import { useState } from "react";
import blogService from "../services/blogs";
import { useDispatch } from "react-redux";
import {
  showInfoNotification,
  showErrorNotification,
} from "../reducers/notification";

import PropTypes from "prop-types";
import { deleteBlog, likeBlog } from "../reducers/blogs";

const blogStyle = {
  borderTopStyle: "solid",
  borderTopWidth: 1,
  padding: 5,
};

const Blog = ({ blog }) => {
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
    dispatch(likeBlog(blog));
  };

  const likeButton = () => <button onClick={handleLike}>like</button>;

  const handleRemove = async () => {
    if (window.confirm(`Delete "${blog.title}" by ${blog.author}?`)) {
      dispatch(deleteBlog(blog));
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
};

export default Blog;
