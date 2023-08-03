import Constants from "expo-constants";
import theme from "../theme";
import AppBarTab from "./AppBarTab";
import styled from "styled-components/native";
import { ScrollView } from "react-native";

const Container = styled.View`
  padding-top: ${Constants.statusBarHeight}px;
  padding-bottom: ${Constants.statusBarHeight}px;
  background-color: ${theme.colors.primary};
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

// display: flex;
//   flex-direction: row;
//   justify-content: space-around;

const AppBar = () => {
  return (
    <Container>
      <ScrollView horizontal indicatorStyle="white">
        <AppBarTab title="REPOSITORIES" link="/" />
        <AppBarTab title="SIGN IN" link="/SignIn" />
        <AppBarTab title="ABOUT" link="/About" />
      </ScrollView>
    </Container>
  );
};

export default AppBar;
