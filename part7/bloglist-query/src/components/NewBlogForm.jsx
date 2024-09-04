import { useState, useRef } from "react";
import blogService from "../services/blogs";
import Togglable from "./Togglable";
import {
  clearNotification,
  setErrorNotification,
  setInfoNotification,
  useNotificationDispatch,
} from "../NotificationContext";
import { useMutation, useQueryClient } from "react-query";

const NewBlogForm = ({ blogs, setBlogs }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const newBlogMutation = useMutation({
    mutationKey: ["newBlog"],
    mutationFn: async (blog) => {
      const { title, author, url } = blog;
      const response = await blogService.postNew({ title, author, url });
      return response;
    },
    onSuccess: (response) => {
      notificationDispatch(
        setInfoNotification("added new blog", {
          title: response.title,
          author: response.author,
        }),
      );

      setTimeout(() => notificationDispatch(clearNotification()), 3000);
      queryClient.setQueryData(["blogs"], (blogs) => blogs.concat(response));
    },
    onError: (response) => {
      console.log(response);
      notificationDispatch(setErrorNotification("Unable to add new blog..."));
      setTimeout(() => notificationDispatch(clearNotification()), 3000);
    },
  });

  const newBlogFormRef = useRef();

  const handleCreateNewBlog = async (event) => {
    event.preventDefault();

    newBlogMutation.mutate({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");

    newBlogFormRef.current.toggleVisibility();
  };

  return (
    <Togglable buttonLabel="new blog" ref={newBlogFormRef}>
      <h2>create new</h2>
      <form className="text-sm text-gray-600" onSubmit={handleCreateNewBlog}>
        <div className="mx-4 flex w-full max-w-md flex-col items-stretch py-4">
          <div className="flex flex-1 flex-row">
            <label htmlFor="title">title:</label>
            <input
              className="my-1 w-full flex-1 shadow-md"
              type="text"
              name="title"
              id="title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-1 flex-row">
            <label htmlFor="author">author:</label>
            <input
              className="my-1 flex-1 shadow-md"
              type="text"
              name="author"
              id="author"
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="flex flex-1 flex-row">
            <label htmlFor="url">url:</label>
            <input
              className="my-1 flex-1 shadow-md"
              type="text"
              name="url"
              id="url"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <button className="text-green-400 hover:text-green-200" type="submit">
          create
        </button>
      </form>
    </Togglable>
  );
};

export default NewBlogForm;
