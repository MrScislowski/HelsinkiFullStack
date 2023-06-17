import { useReducer, createContext } from "react";


// notification: {type: null|error|info, message: null}

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

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {type: null, message: null});

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]} >
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext;

// export default notificationSlice.reducer;
// export const notificationDispatch = {displayTimedInfoNotification, displayTimedErrorNotification};

