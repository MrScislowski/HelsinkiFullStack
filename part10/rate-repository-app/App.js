import RepositoryList from "./src/components/RepositoryList";
import Constants from "expo-constants";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const App = () => {
  return (
    <View style={styles.container}>
      <RepositoryList />
    </View>
  );
};

export default App;
