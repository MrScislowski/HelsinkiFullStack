import { Text } from "react-native";
import { Link } from "react-router-native";

const AppBarTab = (props) => {
  return (
    <Link to={props.link}>
      <Text>{props.title}</Text>
    </Link>
  );
};

export default AppBarTab;
