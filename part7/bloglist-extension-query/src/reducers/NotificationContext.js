import { useReducer, createContext } from "react";
import { useReducerWithThunk } from "./useReducerWithThunk";

// notification: {type: null|error|info, message: null}

/*
alternate way of doing it:
https://stackoverflow.com/questions/73015401/react-update-state-with-timeout-in-reducer
*/

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_INFO":
      return {type: 'info', message: action.payload};
    case "SET_ERROR":
      return {type: 'error', message: action.payload};
    case "CLEAR":
      return {type: null, message: null};
    default:
      return state;
  }
}

const displayInfoMessage = (message) => {
  return {type: 'SET_INFO', payload: message};
}

const displayErrorMessage = (message) => {
  return {type: 'SET_ERROR', payload: message};
}

const clearDisplay = () => {
  return {type: 'CLEAR', payload: null};
}

const displayTimedInfoMessage = (message, duration = 2) => {
  return async (dispatch) => {
    dispatch(displayInfoMessage(message));
    setTimeout(() => dispatch(clearDisplay()), duration*1000);
  }
}

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducerWithThunk(notificationReducer, {type: null, message: null});

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]} >
      {props.children}
    </NotificationContext.Provider>
  )
}

const notificationActions = {displayInfoMessage, displayErrorMessage, clearDisplay, displayTimedInfoMessage};
export {notificationActions};

export default NotificationContext;

// export default notificationSlice.reducer;
// export const notificationDispatch = {displayTimedInfoNotification, displayTimedErrorNotification};

