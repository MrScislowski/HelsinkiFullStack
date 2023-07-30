import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import Text from "./Text";
import theme from "../theme";
import AppBarTab from "./AppBarTab";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight * 2,
    paddingBottom: Constants.statusBarHeight,
    backgroundColor: theme.colors.primary,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    // ...
  },
  item: {},
  // ...
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <AppBarTab title="REPOSITORIES" />
    </View>
  );
};

export default AppBar;
