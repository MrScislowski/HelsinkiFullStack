import { createSlice } from "@reduxjs/toolkit";

const initialState = { newBlogForm: false, blogList: false };

const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    displayNewBlogForm(state, payload) {
      return { ...state, newBlogForm: true };
    },
    hideNewBlogForm(state, payload) {
      return { ...state, newBlogForm: false };
    },
    toggleNewBlogForm(state, payload) {
      return { ...state, newBlogForm: !state.newBlogForm };
    },
    displayBlogList(state, payload) {
      return { ...state, blogList: true };
    },
    hideBlogList(state, payload) {
      return { ...state, blogList: false };
    },
  },
});

export default displaySlice.reducer;
const displayActions = displaySlice.actions;
export { displayActions };
