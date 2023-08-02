import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import theme from "../theme";
import AppBarTab from "./AppBarTab";
import styled from "styled-components/native";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight * 2,
    paddingBottom: Constants.statusBarHeight,
    backgroundColor: theme.colors.primary,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

const MyAppBar = styled.View`
  padding-top: ${Constants.statusBarHeight * 2}px;
  padding-bottom: ${Constants.statusBarHeight}px;
  background-color: ${theme.colors.primary};
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const AppBar = () => {
  return (
    <MyAppBar>
      <AppBarTab title="REPOSITORIES" />
      <AppBarTab title="ABOUT" />
    </MyAppBar>
  );
};

export default AppBar;
