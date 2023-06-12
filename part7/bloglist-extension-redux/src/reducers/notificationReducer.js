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

const displayTimedInfoNotification = (message, duration = 5) => {
  return async dispatch => {
    dispatch(displayInfoNotification(message));
    setTimeout(dispatch(clearNotification()), duration * 1000);
  }
}

const displayTimedErrorNotification = (message, duration = 5) => {
  return async dispatch => {
    dispatch(displayInfoNotification(message));
    setTimeout(dispatch(clearNotification()), duration * 1000);
  }
}

export default notificationSlice.reducer;
export const { displayInfoNotification, displayErrorNotification, clearNotification } = notificationSlice.actions;
export const notificationDispatch = {displayTimedInfoNotification, displayTimedErrorNotification};

