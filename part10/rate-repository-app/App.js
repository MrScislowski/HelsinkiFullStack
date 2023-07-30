import RepositoryList from "./src/components/RepositoryList";
import Constants from "expo-constants";
import { StyleSheet, View } from "react-native";
import AppBar from "./src/components/AppBar";

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const App = () => {
  return (
    <View>
      <AppBar />
      <RepositoryList />
    </View>
  );
};

export default App;
