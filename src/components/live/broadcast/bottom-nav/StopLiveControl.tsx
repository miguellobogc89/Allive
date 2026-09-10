// src/components/live/broadcast/bottom-nav/StopLiveControl.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
} from "react-native";

type StopLiveControlProps = {
  onPress: () => void;
};

export function StopLiveControl({
  onPress,
}: StopLiveControlProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Terminar LIVE"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,

        pressed
          ? styles.pressed
          : null,
      ]}
    >
      <Ionicons
        name="stop"
        size={21}
        color="#FFFFFF"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 54,
    height: 54,

    borderRadius: 27,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FF3048",

    borderWidth: 2,
    borderColor:
      "rgba(255,255,255,0.92)",
  },

  pressed: {
    opacity: 0.78,

    transform: [
      {
        scale: 0.94,
      },
    ],
  },
});