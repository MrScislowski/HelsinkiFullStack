import blogService from "../services/blogs";
// import { displayInfoNotification } from "../reducers/notificationReducer";
import { notificationDispatch } from "../reducers/notificationReducer";

// blog object reference:
// {
//   "title": "t",
//   "author": "a",
//   "url": "u",
//   "likes": 0,
//   "user": "629e077afb2d52d60c2f70dc",
//   "id": "6485b858ffe69b99330d373d"
// }

import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    addBlog(state, action) {
      const newBlog = action.payload;
      return [...state, newBlog];
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      const id = updatedBlog.id;
      return state.map((blog) => (blog.id === id ? updatedBlog : blog));
    },
    deleteBlog(state, action) {
      const id = action.payload.id;
      return state.filter((blog) => blog.id !== id);
    },
    setBlogsFromArray(state, action) {
      const blogList = action.payload;
      return blogList;
    },
  },
});

const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();
    dispatch(blogSlice.actions.setBlogsFromArray(blogs));
    dispatch(notificationDispatch.displayTimedInfoNotification("blogs loaded"));
  };
};

const likeBlog = (blog) => {
    const proposedUpdatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
  return async dispatch => {
    const updatedBlog = await blogService.amendBlog(proposedUpdatedBlog)
    dispatch(blogSlice.actions.updateBlog(updatedBlog));
    dispatch(notificationDispatch.displayTimedInfoNotification(`'${blog.title}' liked`))
  }
}

const deleteBlog = (blog) => {
  return async dispatch => {
    const confirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    );
  
    if (!confirmed) {
      return;
    }

    await blogService.deleteBlog(blog);
    dispatch(blogSlice.actions.deleteBlog(blog));
    dispatch(notificationDispatch.displayTimedInfoNotification(`blog "${blog.title} by ${blog.author} removed`))
  }
}

const {addBlog, updateBlog} = blogSlice.actions
export const blogActions = {addBlog, updateBlog}
export const blogDispatches = {initializeBlogs, likeBlog, deleteBlog}

export default blogSlice.reducer;
