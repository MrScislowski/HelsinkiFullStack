// notification: {type: null|error|info, message: null}

const notificationReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_INFO_MESSAGE":
      return { type: "info", message: action.payload };
    case "SET_ERROR_MESSAGE":
      return { type: "error", message: action.payload };
    case "CLEAR":
      return { type: null, message: "" };
    default:
      return state;
  }
};

const displayInfoNotification = (message) => {
  return { type: "SET_INFO_MESSAGE", payload: message };
};

const displayErrorNotification = (message) => {
  return { type: "SET_ERROR_MESSAGE", payload: message };
};

const clearNotification = () => {
  return { type: "CLEAR" };
};

export default notificationReducer;
export { displayInfoNotification, displayErrorNotification, clearNotification };
