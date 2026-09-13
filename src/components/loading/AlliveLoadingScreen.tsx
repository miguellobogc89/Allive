// src/components/loading/AlliveLoadingScreen.tsx

import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
} from "react-native";

const loadScreenImage =
  require("../../../public/icons/load-screen.png");

export function AlliveLoadingScreen() {
  return (
    <ImageBackground
      source={loadScreenImage}
      style={
        styles.container
      }
      resizeMode="cover"
    >
      <ActivityIndicator
        color="#FFFFFF"
        size="large"
        style={
          styles.spinner
        }
      />
    </ImageBackground>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      position: "relative",

      backgroundColor: "#000000",
    },

    spinner: {
      position: "absolute",

      left: 0,
      right: 0,
      bottom: "33.333%",
    },
  });
