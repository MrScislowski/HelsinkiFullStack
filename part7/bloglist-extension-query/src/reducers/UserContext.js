import { createContext, useReducer } from "react";
import loginService from "../services/login";
import blogService from "../services/blogs";

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {user: action.payload};
    default:
      return state;
  }
}

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, "");

  const setUser = (user) => {
    userDispatch({type: 'SET_USER', payload: user});
  }

  const attemptLogin = async (username, password) => {
    try {
      const response = await loginService.attemptLogin({ username, password });
      blogService.setToken(response.token);
      setUser(response);
      window.localStorage.setItem("blogUserLogin", JSON.stringify(response));
      return true
    } catch (e) {
      return false;
    }
  };

  
  const userExports = {user, setUser, attemptLogin};

  return (
    <UserContext.Provider value={userExports} >
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext;