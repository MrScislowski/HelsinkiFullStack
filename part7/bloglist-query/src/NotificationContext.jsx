import { useContext } from "react";
import { useReducer, createContext } from "react";

// const exampleNotification = {
//   message: "hello",
//   type: "info",
//   data: { detail1: "afternoon", detail2: "usa" },
// };

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET": {
      return action.payload;
    }
    case "CLEAR": {
      return null;
    }
  }
};

export const setInfoNotification = (message, data) => {
  return {
    type: "SET",
    payload: {
      type: "info",
      message,
      data,
    },
  };
};

export const setErrorNotification = (message, data) => {
  return {
    type: "SET",
    payload: {
      type: "error",
      message,
      data,
    },
  };
};

export const clearNotification = () => {
  return {
    type: "CLEAR",
  };
};

export default NotificationContext;

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[1];
};
