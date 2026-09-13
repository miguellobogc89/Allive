// src/components/loading/AlliveLoadingScreen.tsx

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

export function AlliveLoadingScreen() {
  return (
    <View
      style={
        styles.container
      }
    >
      <ActivityIndicator
        color="#FFFFFF"
        size="large"
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor: "#000000",
    },
  });
