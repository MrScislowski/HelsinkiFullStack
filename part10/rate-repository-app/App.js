import RepositoryList from "./src/components/RepositoryList";
import Constants from "expo-constants";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { NativeRouter, Route, Routes, Navigate } from "react-router-native";
import AppBar from "./src/components/AppBar";
import About from "./src/components/About";
import SignIn from "./src/components/SignIn";

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
  },
});

const App = () => {
  return (
    <NativeRouter>
      <View style={styles.container}>
        <AppBar />
        <Routes>
          <Route path="/" element={<RepositoryList />} exact />
          <Route path="/About" element={<About />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </View>
    </NativeRouter>
  );
};

export default App;
