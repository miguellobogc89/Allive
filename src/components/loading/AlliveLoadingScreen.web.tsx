// src/components/loading/AlliveLoadingScreen.web.tsx

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
} from "react-native";

const loadScreenImage =
  require("../../../public/icons/load-screen.png");

const loadScreenUri =
  Image.resolveAssetSource(
    loadScreenImage,
  ).uri;

const webBackgroundStyle =
  {
    backgroundImage: `url(${loadScreenUri})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  } as Record<string, string>;

export function AlliveLoadingScreen() {
  return (
    <View
      style={
        [
          styles.container,
          webBackgroundStyle,
        ]
      }
    >
      <ActivityIndicator
        color="#FFFFFF"
        size="large"
        style={
          styles.spinner
        }
      />
    </View>
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
