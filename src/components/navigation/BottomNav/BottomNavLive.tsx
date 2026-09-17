// src/components/navigation/BottomNav/BottomNavLive.tsx

import {
  Text,
  View,
} from "react-native";

export function BottomNavLive() {
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
        LIVE CONTROLS
      </Text>
    </View>
  );
}