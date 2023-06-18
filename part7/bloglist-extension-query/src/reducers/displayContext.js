import { createContext, useReducer } from "react";

const displayReducer = (state, action) => {
  switch (action.type) {
    case "SHOW_ADD_FORM":
      return { ...state, addForm: true };
    case "HIDE_ADD_FORM":
      return { ...state, addForm: false };
    case "TOGGLE_ADD_FORM":
      return { ...state, addForm: !state.addForm };
    default:
      return state;
  }
};

export const DisplayContext = createContext();

export const DisplayContextProvider = (props) => {
  const [display, displayDispatch] = useReducer(displayReducer, {addForm: false});

  const hideAddForm = () => {
    displayDispatch({ type: "HIDE_ADD_FORM" });
  };

  const showAddForm = () => {
    displayDispatch({ type: "SHOW_ADD_FORM" });
  };

  const userExports = { display, hideAddForm, showAddForm };

  return (
    <DisplayContext.Provider value={userExports}>
      {props.children}
    </DisplayContext.Provider>
  );
};

export default DisplayContext;
