import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { showErrorNotification, showInfoNotification } from "./notification";

const initialState = [];

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      return [...state, action.payload];
    },
    replaceBlog(state, action) {
      const replacement = action.payload;
      return state.map((blog) =>
        blog.id !== replacement.id ? blog : replacement
      );
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload.id);
    },
  },
});

export const { setBlogs, addBlog, replaceBlog, removeBlog } = blogSlice.actions;

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const amendedBlog = await blogService.putAmended({
      ...blog,
      likes: blog.likes + 1,
    });
    dispatch(replaceBlog({ ...amendedBlog, user: blog.user }));
    dispatch(showInfoNotification(`"${blog.title}" liked`));
  };
};

export const fetchBlogs = () => {
  return async (dispatch) => {
    const data = await blogService.getAll();
    dispatch(setBlogs(data));
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      const response = await blogService.deleteBlog(blog);
      dispatch(removeBlog(blog));
      dispatch(showInfoNotification(`"${blog.title}" removed`));
    } catch (e) {
      const message = e?.response?.data?.error;
      dispatch(showErrorNotification(message || "could not remove blog"));
    }
  };
};

export const postBlog = (blogData) => {
  return async (dispatch) => {
    const { title, author, url } = blogData;
    const response = await blogService.postNew({ title, author, url });
    dispatch(addBlog(response));
    dispatch(
      showInfoNotification("added new blog", {
        title: response.title,
        author: response.author,
      })
    );
  };
};

export default blogSlice.reducer;
