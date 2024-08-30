import { useState } from "react";
import blogService from "../services/blogs";

import {
  clearNotification,
  setErrorNotification,
  setInfoNotification,
  useNotificationDispatch,
} from "../NotificationContext";

const Blog = ({ blog, blogs, setBlogs }) => {
  const notificationDispatch = useNotificationDispatch();
  const blogStyle = {
    borderTopStyle: "solid",
    borderTopWidth: 1,
    padding: 5,
  };

  const [showDetails, setShowDetails] = useState(false);

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

    notificationDispatch(setInfoNotification(`"${blog.title}" liked`));
    setTimeout(() => notificationDispatch(clearNotification()), 3000);
  };

  const likeButton = () => <button onClick={handleLike}>like</button>;

  const handleRemove = async () => {
    if (window.confirm(`Delete "${blog.title}" by ${blog.author}?`)) {
      try {
        const response = await blogService.deleteBlog(blog);
        notificationDispatch(setInfoNotification(`"${blog.title}" removed`));
        setTimeout(() => notificationDispatch(clearNotification()), 3000);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
      } catch (e) {
        const message = e?.response?.data?.error;
        notificationDispatch(
          setErrorNotification(message || "could not remove blog")
        );
        setTimeout(() => notificationDispatch(clearNotification()), 3000);
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

export default Blog;
