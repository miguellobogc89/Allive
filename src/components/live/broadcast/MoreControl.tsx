// src/components/live/broadcast/bottom-nav/LiveControlButton.tsx

import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Pressable, StyleSheet } from "react-native";

type IconName = ComponentProps<typeof Ionicons>["name"];

type LiveControlButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
  danger?: boolean;
};

export function LiveControlButton({
  icon,
  accessibilityLabel,
  onPress,
  danger = false,
}: LiveControlButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        danger && styles.danger,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={icon} size={20} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(32,32,32,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
  },
  danger: {
    backgroundColor: "rgba(105,22,29,0.72)",
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.94 }],
  },
});
