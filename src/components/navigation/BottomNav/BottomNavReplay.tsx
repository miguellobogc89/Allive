// src/components/navigation/BottomNav/BottomNavReplay.tsx

import {
  Text,
  View,
} from "react-native";

export function BottomNavReplay() {
  return (
    <View
      style={{
        flex: 1,
        alignItems:
          "center",
        justifyContent:
          "center",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: "700",
        }}
      >
        REPLAY CONTROLS
      </Text>
    </View>
  );
}