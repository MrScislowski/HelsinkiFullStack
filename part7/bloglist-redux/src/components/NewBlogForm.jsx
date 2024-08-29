import { useState, useRef } from "react";
import blogService from "../services/blogs";
import Togglable from "./Togglable";
import { showInfoNotification } from "../reducers/notification";
import { addBlog } from "../reducers/blogs";

import { useDispatch } from "react-redux";

const NewBlogForm = ({ blogs, setBlogs }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();

  const newBlogFormRef = useRef();

  const handleCreateNewBlog = async (event) => {
    event.preventDefault();

    try {
      const response = await blogService.postNew({ title, author, url });

      setTitle("");
      setAuthor("");
      setUrl("");

      newBlogFormRef.current.toggleVisibility();

      dispatch(
        showInfoNotification("added new blog", {
          title: response.title,
          author: response.author,
        })
      );

      dispatch(addBlog(response));
    } catch (e) {
      console.dir(e);
    }
  };

  return (
    <>
      <Togglable buttonLabel="new blog" ref={newBlogFormRef}>
        <h2>create new</h2>
        <form onSubmit={handleCreateNewBlog}>
          <label htmlFor="title">title:</label>
          <input
            type="text"
            name="title"
            id="title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <label htmlFor="author">author:</label>
          <input
            type="text"
            name="author"
            id="author"
            onChange={(e) => setAuthor(e.target.value)}
          />
          <br />
          <label htmlFor="url">url:</label>
          <input
            type="text"
            name="url"
            id="url"
            onChange={(e) => setUrl(e.target.value)}
          />
          <br />
          <button type="submit">create</button>
        </form>
      </Togglable>
    </>
  );
};

export default NewBlogForm;
