// src/components/live/broadcast/controls/MicrophoneControl.tsx

import { Pressable, StyleSheet, Text, View } from "react-native";

type MicrophoneControlProps = {
  enabled: boolean;
  onPress: () => void;
};

export function MicrophoneControl({
  enabled,
  onPress,
}: MicrophoneControlProps) {
  return (
    <Pressable
      accessibilityLabel={
        enabled ? "Silenciar micrófono" : "Activar micrófono"
      }
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        !enabled && styles.buttonDisabled,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.mic}>
        <View style={styles.capsule} />
        <View style={styles.stem} />
        <View style={styles.base} />
        {!enabled ? <View style={styles.slash} /> : null}
      </View>
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
  buttonDisabled: {
    backgroundColor: "rgba(95,20,20,0.78)",
  },
  mic: {
    width: 22,
    height: 28,
    alignItems: "center",
  },
  capsule: {
    width: 9,
    height: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  stem: {
    width: 2,
    height: 7,
    backgroundColor: "#FFFFFF",
  },
  base: {
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFFFFF",
  },
  slash: {
    position: "absolute",
    width: 28,
    height: 2,
    top: 12,
    transform: [{ rotate: "-45deg" }],
    backgroundColor: "#FFFFFF",
  },
  pressed: {
    opacity: 0.72,
  },
});
