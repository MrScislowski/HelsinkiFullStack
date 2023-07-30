import { Pressable, StyleSheet } from "react-native";
import Text from "./Text";

const styles = StyleSheet.create({
  item: {},
});

const AppBarTab = (props) => {
  return (
    <Pressable
      style={styles.item}
      onPress={() => {
        console.log("app bar pressed");
      }}
    >
      <Text>{props.title}</Text>
    </Pressable>
  );
};

export default AppBarTab;
