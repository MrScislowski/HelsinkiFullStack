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
      return state.map(blog => (blog.id === id )? updatedBlog : blog)
    },
    deleteBlog(state, action) {
      const id = action.payload.id;
      return state.filter(blog => blog.id !== id);
    },
    likeBlog(state, action) {},
    setBlogsFromArray(state, action) {
      const blogList = action.payload;
      return blogList;
    }
  },
});

export default blogSlice.reducer;
export const blogActions = blogSlice.actions;
