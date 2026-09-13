// src/components/navigation/BackButton.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
} from "react-native";

type BackButtonProps = {
  onPress: () => void;
  light?: boolean;
};

export function BackButton({
  onPress,
  light = false,
}: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [
        styles.button,
        pressed &&
          styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Volver"
    >
      <Ionicons
        name="chevron-back"
        size={30}
        color={
          light
            ? "#FFFFFF"
            : "#111111"
        }
      />
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    button: {
      width: 44,
      height: 44,

      alignItems: "center",
      justifyContent:
        "center",
    },

    pressed: {
      opacity: 0.55,
    },
  });