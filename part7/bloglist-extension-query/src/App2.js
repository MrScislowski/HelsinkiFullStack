// import { NotificationContext} from "./reducers/NotificationContext";
// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
import { MantineProvider, Text } from "@mantine/core";

const App2 = (props) => {

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Text>Welcome to Mantine!</Text>
      <p>paragraph element...</p>
    </MantineProvider>
  );
}

export default App2;