// src/components/live/broadcast/controls/MoreControl.tsx

import { Pressable, StyleSheet, Text } from "react-native";

type MoreControlProps = {
  onPress: () => void;
};

export function MoreControl({ onPress }: MoreControlProps) {
  return (
    <Pressable
      accessibilityLabel="Título y evento"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.icon}>•••</Text>
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
    marginTop: -7,
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.72,
  },
});
