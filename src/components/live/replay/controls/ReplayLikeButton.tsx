// src/components/live/replay/controls/ReplayLikeButton.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
} from "react-native";

type ReplayLikeButtonProps = {
  liked: boolean;
  loading?: boolean;
  onPress: () => void;
};

export function ReplayLikeButton({
  liked,
  loading = false,
  onPress,
}: ReplayLikeButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        liked
          ? "Quitar me gusta"
          : "Me gusta"
      }
      disabled={loading}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed
          ? styles.pressed
          : null,
        loading
          ? styles.loading
          : null,
      ]}
    >
      <Ionicons
        name={
          liked
            ? "heart"
            : "heart-outline"
        }
        size={26}
        color={
          liked
            ? "#FF3048"
            : "#FFFFFF"
        }
      />
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    button: {
      width: 46,
      height: 46,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 23,

      backgroundColor:
        "rgba(0,0,0,0.38)",

      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.38)",
    },

    pressed: {
      transform: [
        {
          scale: 0.94,
        },
      ],
    },

    loading: {
      opacity: 0.55,
    },
  });