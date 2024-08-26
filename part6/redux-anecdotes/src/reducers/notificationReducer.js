import { createSlice } from "@reduxjs/toolkit"

const initialState = 'initial notification message!'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      state = action.payload
    }
  }
})

export const { setNotification } = notificationSlice.actions
export default notificationSlice.reducer