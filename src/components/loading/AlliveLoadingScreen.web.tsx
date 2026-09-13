// src/components/loading/AlliveLoadingScreen.web.tsx

import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";

const loadScreenImage =
  require("../../../public/icons/load-screen.png");

export function AlliveLoadingScreen() {
  return (
    <View
      style={
        styles.container
      }
    >
<ImageBackground
  source={loadScreenImage}
  resizeMode="cover"
  style={styles.background}
  imageStyle={styles.backgroundImage}
>
  <ActivityIndicator
    color="#FFFFFF"
    size="large"
    style={styles.spinner}
  />
</ImageBackground>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        "#000000",
    },

    background: {
      flex: 1,
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },

    backgroundImage: {
      width: "100%",
      height: "100%",
    },

    spinner: {
      position:
        "absolute",

      left: 0,
      right: 0,
      bottom: "33.333%",
    },
  });