import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import LoginScreen from "./src/screens/Login.js";
import { useAuthStore } from "./src/stores/authStore.js";

export default function App() {
  const loadTokens = useAuthStore((state) => state.loadTokens);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    loadTokens();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LoginScreen />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
