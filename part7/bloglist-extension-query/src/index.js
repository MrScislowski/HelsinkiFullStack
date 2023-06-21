import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import App2 from "./App2";
import "./index.css";
import { NotificationContextProvider } from "./reducers/NotificationContext";
import { UserContextProvider } from "./reducers/UserContext";
import { DisplayContextProvider } from "./reducers/displayContext";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <DisplayContextProvider>
      <NotificationContextProvider>
        <UserContextProvider>
          <App2 />
        </UserContextProvider>
      </NotificationContextProvider>
      </DisplayContextProvider>
  </QueryClientProvider>
);
