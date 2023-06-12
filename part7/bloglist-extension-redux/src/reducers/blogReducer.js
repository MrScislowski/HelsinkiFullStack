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
      console.log(JSON.stringify(newBlog));
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
    likeBlog(state, action) {
      const blogBeforeLike = action.payload;
      const id = blogBeforeLike.id;
      const likesBefore = blogBeforeLike.likes;
      const blogAfterLike = { ...blogBeforeLike, likes: likesBefore + 1 };
      return state.map((blog) => (blog.id === id ? blogAfterLike : blog));
    },
    setBlogsFromArray(state, action) {
      const blogList = action.payload;
      return blogList;
    },
  },
});

const {addBlog, updateBlog, deleteBlog} = blogSlice.actions;

const reducerActionsToExport = {addBlog, updateBlog, deleteBlog, likeBlog} 

let blogActions = reducerActionsToExport;

// const updateBlog = async (updatedBlogObject) => {
//   const updatedBlog = await blogService.amendBlog(updatedBlogObject);
//   dispatch(blogActions.updateBlog(updatedBlog));
//   dispatch(
//     displayInfoNotification(
//       `blog "${updatedBlog.title}" by ${updatedBlog.author} updated`
//     )
//   );
// };

const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();
    dispatch(blogSlice.actions.setBlogsFromArray(blogs));
    dispatch(notificationDispatch.displayTimedInfoNotification("blogs loaded"));
  };
};

const likeBlog = (blog) => {
  const { title, author, url, likes, user, id } = blog
    const updatedBlog = {
      title,
      author,
      url,
      id,
      likes: likes + 1,
      user: user.id,
    }
  return async dispatch => {
    await updateBlog(updatedBlog)
    dispatch(blogSlice.actions.updateBlog(blog));
    dispatch(notificationDispatch.displayTimedInfoNotification(`'${blog.title}' liked`))
  }
}

// blogActions = { ...blogActions, initializeBlogs };
blogActions = {addBlog, updateBlog, deleteBlog}
export { blogActions }
export const blogDispatches = {initializeBlogs, likeBlog}

export default blogSlice.reducer;
