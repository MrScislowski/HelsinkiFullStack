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

export const showInfoNotification = (message, data) => {
  return async (dispatch) => {
    dispatch(setNotification({ type: "info", message, data }));
    setTimeout(() => dispatch(hideNotification()), NOTIFICATION_DURATION);
  };
};

export const showErrorNotification = (message, data) => {
  return async (dispatch) => {
    dispatch(setNotification({ type: "error", message, data }));
    setTimeout(() => dispatch(hideNotification()));
  };
};

export default notificationSlice.reducer;
