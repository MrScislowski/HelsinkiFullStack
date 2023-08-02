import RepositoryList from "./src/components/RepositoryList";
import Constants from "expo-constants";
import { StyleSheet, View, Pressable, Text } from "react-native";
import AppBar from "./src/components/AppBar";

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
  },
});

const App = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <RepositoryList />
    </View>
  );
};

export default App;
