import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import App2 from "./App2";
import "./index.css";
import { NotificationContextProvider } from "./reducers/NotificationContext";
import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";
import displayReducer from "./reducers/displayReducer";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    user: userReducer,
    display: displayReducer,
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </Provider>
  </QueryClientProvider>
);
