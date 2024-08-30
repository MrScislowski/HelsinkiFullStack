import { useState } from "react";
import blogService from "../services/blogs";
import { useMutation, useQueryClient } from "react-query";

import {
  clearNotification,
  setErrorNotification,
  setInfoNotification,
  useNotificationDispatch,
} from "../NotificationContext";

const Blog = ({ blog }) => {
  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationKey: ["likeBlog"],
    mutationFn: async (blog) => {
      const result = await blogService.putAmended({
        ...blog,
        likes: blog.likes + 1,
      });
      return result;
    },
    onSuccess: (result) => {
      queryClient.setQueryData(["blogs"], (blogs) =>
        blogs
          .map((b) => (b.id === result.id ? { ...result, user: b.user } : b))
          .sort((b1, b2) => b2.likes - b1.likes)
      );
      notificationDispatch(setInfoNotification(`"${result.title}" liked`));
      setTimeout(() => notificationDispatch(clearNotification()), 3000);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["deleteBlog"],
    mutationFn: async (blog) => {
      const result = await blogService.deleteBlog(blog);
      return result;
    },
    onSuccess: () => {
      queryClient.setQueryData(["blogs"], (blogs) =>
        blogs.filter((b) => b.id !== blog.id)
      );
      notificationDispatch(setInfoNotification(`"${blog.title}" deleted`));
      setTimeout(() => notificationDispatch(clearNotification()), 3000);
    },
  });

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
    await likeMutation.mutate(blog);
  };

  const likeButton = () => <button onClick={handleLike}>like</button>;

  const handleRemove = async () => {
    if (window.confirm(`Delete "${blog.title}" by ${blog.author}?`)) {
      deleteMutation.mutate(blog);
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
