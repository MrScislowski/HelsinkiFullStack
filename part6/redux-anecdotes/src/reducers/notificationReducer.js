import { createSlice } from "@reduxjs/toolkit";

const initialState = ""

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification(state, action) {
      return action.payload
    },

    clearNotifications(state, action) {
      return ''
    }
  }
})


export const { addNotification, clearNotifications } = notificationSlice.actions
export default notificationSlice.reducer