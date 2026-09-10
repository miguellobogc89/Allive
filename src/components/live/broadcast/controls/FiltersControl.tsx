// src/components/live/broadcast/controls/FiltersControl.tsx

import { Pressable, StyleSheet, View } from "react-native";

type FiltersControlProps = {
  onPress: () => void;
};

export function FiltersControl({
  onPress,
}: FiltersControlProps) {
  return (
    <Pressable
      accessibilityLabel="Filtros"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.icon}>
        <View style={[styles.circle, styles.circleOne]} />
        <View style={[styles.circle, styles.circleTwo]} />
        <View style={[styles.circle, styles.circleThree]} />
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
  icon: {
    width: 25,
    height: 25,
  },
  circle: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  circleOne: {
    left: 5,
    top: 0,
  },
  circleTwo: {
    left: 0,
    bottom: 0,
  },
  circleThree: {
    right: 0,
    bottom: 0,
  },
  pressed: {
    opacity: 0.72,
  },
});
