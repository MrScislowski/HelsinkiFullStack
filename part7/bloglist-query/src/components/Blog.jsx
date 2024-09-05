import { useState } from "react";
import blogService from "../services/blogs";
import { useMutation, useQueryClient } from "react-query";

import {
  clearNotification,
  setInfoNotification,
  useNotificationDispatch,
} from "../NotificationContext";
import { Link } from "react-router-dom";
import useLikeMutation from "./useLikeMutation";

const Blog = ({ blog }) => {
  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();
  const likeMutation = useLikeMutation();

  const deleteMutation = useMutation({
    mutationKey: ["deleteBlog"],
    mutationFn: async (blog) => {
      const result = await blogService.deleteBlog(blog);
      return result;
    },
    onSuccess: () => {
      queryClient.setQueryData(["blogs"], (blogs) =>
        blogs.filter((b) => b.id !== blog.id),
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
      <button
        className={`rounded-md bg-slate-300 p-1 hover:bg-slate-400`}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "hide" : "show"}
      </button>
    );
  };

  const likeButton = () => (
    <button
      className="rounded-lg bg-green-200 p-1 hover:bg-green-300"
      onClick={() => likeMutation.mutate(blog)}
    >
      +
    </button>
  );

  const handleRemove = async () => {
    if (window.confirm(`Delete "${blog.title}" by ${blog.author}?`)) {
      deleteMutation.mutate(blog);
    }
  };

  const removeButton = () => (
    <button
      className="rounded-md bg-red-300 p-1 hover:bg-red-400"
      onClick={handleRemove}
    >
      remove
    </button>
  );

  const currentUserName = JSON.parse(
    localStorage.getItem("loggedInBloglistUser"),
  )?.name;

  const details = () => (
    <div data-testid="blog-details">
      <ul>
        <li data-testid="blog-url">{blog.url}</li>
        <li data-testid="blog-likes">
          likes: {blog.likes} {likeButton()}
        </li>
        <li data-testid="blog-user"> {blog.user.name} </li>
      </ul>
      {blog.user.name === currentUserName && removeButton()}
    </div>
  );

  return (
    <article className="ml-2 max-w-lg border-2 pl-2" data-testid="blog-item">
      <p data-testid="blog-summary">
        <Link className="text-blue-400 underline" to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
        {toggleButton()}
      </p>
      {showDetails && details()}
    </article>
  );
};

export default Blog;
