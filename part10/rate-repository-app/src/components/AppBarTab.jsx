import { Text } from "react-native";
import { Link } from "react-router-native";
import styled from "styled-components/native";

const Container = styled.View`
  padding-left: 5px;
  padding-right: 5px;
`;

const AppBarTab = (props) => {
  return (
    <Container>
      <Link to={props.link}>
        <Text>{props.title}</Text>
      </Link>
    </Container>
  );
};

export default AppBarTab;
