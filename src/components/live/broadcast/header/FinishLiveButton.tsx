// src/components/live/broadcast/header/FinishLiveButton.tsx

import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type FinishLiveButtonProps = {
  onPress: () => void;
};

export function FinishLiveButton({
  onPress,
}: FinishLiveButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Terminar LIVE"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>
        Terminar
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 38,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3048",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.78,
  },
});
