import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { MantineProvider, Text } from "@mantine/core";
import { NotificationContextProvider } from "./reducers/NotificationContext";
import { UserContextProvider } from "./reducers/UserContext";
import { DisplayContextProvider } from "./reducers/displayContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider
      theme={{
        fontFamily: "Open Sans, sans serif",
        spacing: { xs: '1rem', sm: '1.2rem', md: '1.8rem', lg: '2.2rem', xl: '2.8rem'}
      }} withGlobalStyles withNormalizeCSS
    >
      <DisplayContextProvider>
        <NotificationContextProvider>
          <UserContextProvider>
            <Router>
              <App />
            </Router>
          </UserContextProvider>
        </NotificationContextProvider>
      </DisplayContextProvider>
    </MantineProvider>
  </QueryClientProvider>
);
