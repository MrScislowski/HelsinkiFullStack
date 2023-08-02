import Constants from "expo-constants";
import theme from "../theme";
import AppBarTab from "./AppBarTab";
import styled from "styled-components/native";

const Container = styled.View`
  padding-top: ${Constants.statusBarHeight}px;
  padding-bottom: ${Constants.statusBarHeight}px;
  background-color: ${theme.colors.primary};
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const AppBar = () => {
  return (
    <Container>
      <AppBarTab title="REPOSITORIES" />
      <AppBarTab title="ABOUT" />
    </Container>
  );
};

export default AppBar;
