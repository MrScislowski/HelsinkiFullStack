import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

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
  },
});

export const { setBlogs, addBlog, replaceBlog } = blogSlice.actions;

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const amendedBlog = await blogService.putAmended({
      ...blog,
      likes: blog.likes + 1,
    });
    dispatch(replaceBlog(amendedBlog));
  };
};

export default blogSlice.reducer;
