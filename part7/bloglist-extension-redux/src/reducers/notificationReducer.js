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

export default notificationReducer;
