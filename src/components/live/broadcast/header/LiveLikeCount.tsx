// src/components/live/broadcast/header/LiveLikeCount.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type LiveLikeCountProps = {
  likes: number;
};

function formatCount(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000)
      .toFixed(1)
      .replace(".0", "")}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000)
      .toFixed(1)
      .replace(".0", "")}K`;
  }

  return String(value);
}

export function LiveLikeCount({
  likes,
}: LiveLikeCountProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="heart"
        size={14}
        color="#FFFFFF"
      />
      <Text style={styles.text}>
        {formatCount(likes)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
