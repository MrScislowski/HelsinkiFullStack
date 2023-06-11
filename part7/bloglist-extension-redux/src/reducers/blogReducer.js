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
      console.log(JSON.stringify(newBlog))
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
    likeBlog(state, action) {
      const blogBeforeLike = action.payload;
      const id = blogBeforeLike.id;
      const likesBefore = blogBeforeLike.likes;
      const blogAfterLike = {...blogBeforeLike, likes: likesBefore + 1};
      return state.map(blog => (blog.id === id )? blogAfterLike : blog)
    },
    setBlogsFromArray(state, action) {
      const blogList = action.payload;
      return blogList;
    }
  },
});

export default blogSlice.reducer;
export const blogActions = blogSlice.actions;
