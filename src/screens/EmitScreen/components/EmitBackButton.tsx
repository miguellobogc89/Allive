// src/screens/EmitScreen/components/EmitBackButton.tsx

import {
  ArrowLeft,
} from "lucide-react-native";

import {
  Pressable,
  StyleSheet,
} from "react-native";

type EmitBackButtonProps = {
  onPress?: () => void;
};

export function EmitBackButton({
  onPress,
}: EmitBackButtonProps) {
  if (!onPress) {
    return null;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Volver"
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed &&
          styles.buttonPressed,
      ]}
    >
      <ArrowLeft
        size={24}
        color="#FFFFFF"
        strokeWidth={2.4}
      />
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    button: {
      position: "absolute",

      top: 16,
      left: 16,

      width: 42,
      height: 42,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 21,

      backgroundColor:
        "rgba(12,13,16,0.48)",

      zIndex: 100,
    },

    buttonPressed: {
      opacity: 0.7,

      transform: [
        {
          scale: 0.94,
        },
      ],
    },
  });