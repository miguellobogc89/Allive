// src/components/profile/header/ProfileHeroMask.tsx

import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  View,
} from "react-native";

export function ProfileHeroMask() {
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.92)",
          "rgba(0,0,0,0.72)",
          "rgba(0,0,0,0.42)",
          "rgba(0,0,0,0.16)",
          "rgba(0,0,0,0)",
        ]}
        locations={[
          0,
          0.24,
          0.48,
          0.72,
          1,
        ]}
        start={{
          x: 0.5,
          y: 0,
        }}
        end={{
          x: 0.5,
          y: 1,
        }}
        style={styles.topGradient}
      />

      <LinearGradient
        colors={[
          "rgba(6,16,26,0)",
          "rgba(6,16,26,0.12)",
          "rgba(6,16,26,0.55)",
          "#06101A",
        ]}
        locations={[
          0,
          0.35,
          0.72,
          1,
        ]}
        start={{
          x: 0.5,
          y: 0,
        }}
        end={{
          x: 0.5,
          y: 1,
        }}
        style={styles.bottomGradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 165,
  },

  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
});