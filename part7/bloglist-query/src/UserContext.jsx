import { useContext } from "react";
import { useReducer, createContext } from "react";

const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET": {
      return action.payload;
    }
    case "CLEAR": {
      return null;
    }
  }
};

export const setUser = (user) => {
  return {
    type: "SET",
    payload: user,
  };
};

export const clearUser = () => {
  return {
    type: "CLEAR",
  };
};

export default UserContext;

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[0];
};

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[1];
};
