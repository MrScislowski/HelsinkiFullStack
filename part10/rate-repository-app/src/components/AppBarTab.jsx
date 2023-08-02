import { Pressable, Text } from "react-native";

const AppBarTab = (props) => {
  return (
    <Pressable>
      <Text>{props.title}</Text>
    </Pressable>
  );
};

export default AppBarTab;
