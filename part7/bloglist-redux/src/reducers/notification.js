import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const NOTIFICATION_DURATION = 3000;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    hideNotification(state, action) {
      return null;
    },
  },
});

const { setNotification, hideNotification } = notificationSlice.actions;

export const showInfoNotification = (message) => {
  return async (dispatch) => {
    dispatch(setNotification({ type: "info", message }));
    setTimeout(() => dispatch(hideNotification()), NOTIFICATION_DURATION);
  };
};

export const showErrorNotification = (message) => {
  return async (dispatch) => {
    dispatch(setNotification({ type: "error", message }));
    setTimeout(() => dispatch(hideNotification()));
  };
};

export default notificationSlice.reducer;
