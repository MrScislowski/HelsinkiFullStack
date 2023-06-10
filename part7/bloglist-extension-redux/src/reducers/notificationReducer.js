// notification: {type: null|error|info, message: null}

import { createSlice } from "@reduxjs/toolkit";

const initialState = { type: null };

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    displayInfoNotification(state, action) {
      return { type: "info", message: action.payload };
    },
    displayErrorNotification(state, action) {
      return { type: "error", message: action.payload };
    },
    clearNotification(state, action) {
      return { type: null, message: null };
    },
  },
});

export default notificationSlice.reducer
export const { displayInfoNotification, displayErrorNotification, clearNotification } = notificationSlice.actions
