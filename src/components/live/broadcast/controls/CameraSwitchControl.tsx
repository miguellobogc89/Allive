// src/components/live/broadcast/controls/CameraSwitchControl.tsx

import { Pressable, StyleSheet, Text } from "react-native";

type CameraSwitchControlProps = {
  onPress: () => void;
};

export function CameraSwitchControl({
  onPress,
}: CameraSwitchControlProps) {
  return (
    <Pressable
      accessibilityLabel="Cambiar cámara"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.icon}>↻</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(18,18,18,0.72)",
  },
  icon: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.72,
  },
});
