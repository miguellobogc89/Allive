// src/components/profile/header/ProfileEditButton.tsx

import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  onPress: () => void;
};

export function ProfileEditButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>Editar perfil</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 108,
    height: 36,
    paddingHorizontal: 17,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A9DFF",
    backgroundColor: "rgba(4,14,24,0.46)",
  },

  pressed: {
    opacity: 0.72,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
