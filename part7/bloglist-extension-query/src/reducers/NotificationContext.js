import { createContext, useReducer } from "react";

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

export const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {type: null, message: null});

  const displayInfoMessage = (message) => {
    notificationDispatch({type: 'SET_INFO', payload: message});
  }
  
  const displayErrorMessage = (message) => {
    notificationDispatch({type: 'SET_ERROR', payload: message});
  }
  
  const clearDisplay = () => {
    notificationDispatch({type: 'CLEAR', payload: null});
  }
  
  const displayTimedInfoMessage = (message, duration = 2) => {
    displayInfoMessage(message);
    setTimeout(() => clearDisplay(), duration*1000);
  }

  const displayTimedErrorMessage = (message, duration = 2) => {
    displayErrorMessage(message);
    setTimeout(() => clearDisplay(), duration*1000);
  }

  // TODO: here it's possible to use other reducers so have access to their dispatches, and define the action creators here. And pass them all in value, instead of just the notification value and its dispatch.
  // then in other ContextProviders, we can useContext(NotificationContext), and get all those functions. But if I'm keeping some things implemented in redux, is that going to be possible...?
  // ...possibly not. So maybe just implement the easiest thing (e.g. logged in user) alongside using useReducer/Context, and see if those two things play well together. Because the blog stuff is going to be managed by react-query

  const notificationExports = {displayTimedInfoMessage, displayTimedErrorMessage, notification};

  return (
    <NotificationContext.Provider value={notificationExports} >
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext;

// export default notificationSlice.reducer;
// export const notificationDispatch = {displayTimedInfoNotification, displayTimedErrorNotification};

