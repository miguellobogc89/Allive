// src/components/live/broadcast/bottom-nav/LiveControlButton.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  ComponentProps,
} from "react";

import {
  Pressable,
  StyleSheet,
} from "react-native";

type IconName =
  ComponentProps<
    typeof Ionicons
  >["name"];

type LiveControlButtonProps = {
  icon: IconName;

  accessibilityLabel: string;

  onPress: () => void;

  danger?: boolean;
  disabled?: boolean;
};

export function LiveControlButton({
  icon,
  accessibilityLabel,
  onPress,
  danger = false,
  disabled = false,
}: LiveControlButtonProps) {
  return (
    <Pressable
      accessibilityLabel={
        accessibilityLabel
      }
      accessibilityRole="button"
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,

        danger
          ? styles.danger
          : null,

        disabled
          ? styles.disabled
          : null,

        pressed && !disabled
          ? styles.pressed
          : null,
      ]}
    >
      <Ionicons
        name={icon}
        size={21}
        color={
          danger
            ? "#FF5A6B"
            : "#FFFFFF"
        }
      />
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

    backgroundColor:
      "rgba(0,0,0,0.38)",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.38)",
  },

  danger: {
    backgroundColor:
      "rgba(0,0,0,0.38)",

    borderColor:
      "rgba(255,90,107,0.65)",
  },

  disabled: {
    opacity: 0.38,
  },

  pressed: {
    opacity: 0.72,

    transform: [
      {
        scale: 0.94,
      },
    ],
  },
});
