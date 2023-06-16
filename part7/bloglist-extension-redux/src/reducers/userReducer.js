import { createSlice } from "@reduxjs/toolkit";
import  blogService  from "../services/blogs";
import  loginService  from "../services/login";

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

const { setUser } = userSlice.actions;

const attemptLogin = (username, password) => {
  return async (dispatch) => {
      const response = await loginService.attemptLogin({ username, password });
      console.log(`response was:`)
      console.dir(response)
      blogService.setToken(response.token);
      dispatch(setUser(response));
      window.localStorage.setItem("blogUserLogin", JSON.stringify(response));
  };
};

export default userSlice.reducer;

const userActions = { attemptLogin, setUser };
export { userActions };
