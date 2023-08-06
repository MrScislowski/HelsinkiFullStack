import RepositoryList from "./src/components/RepositoryList";
import Constants from "expo-constants";
import { StyleSheet, View, Platform } from "react-native";
import { NativeRouter, Route, Routes, Navigate } from "react-router-native";
import styled from "styled-components/native";
import AppBar from "./src/components/AppBar";
import About from "./src/components/About";
import SignIn from "./src/components/SignIn";
import { ApolloProvider } from "@apollo/client";
import createApolloClient from "./src/utils/apolloClient";
const apolloClient = createApolloClient();

const fontFamily = Platform.select({
  ios: "Arial",
  android: "Roboto",
});

const Container = styled.View`
  margin-top: ${Constants.statusBarHeight}px;
  font-family: ${fontFamily};
`;

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <Container>
          <AppBar />
          <Routes>
            <Route path="/" element={<RepositoryList />} exact />
            <Route path="/About" element={<About />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </ApolloProvider>
    </NativeRouter>
  );
};

export default App;
