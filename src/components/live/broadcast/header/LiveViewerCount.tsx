// src/components/live/broadcast/header/LiveViewerCount.tsx

import {
  Feather,
} from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type LiveViewerCountProps = {
  viewers: number;
};

function formatCount(
  value: number,
) {
  if (value >= 1_000_000) {
    return `${(
      value / 1_000_000
    )
      .toFixed(1)
      .replace(".0", "")}M`;
  }

  if (value >= 1_000) {
    return `${(
      value / 1_000
    )
      .toFixed(1)
      .replace(".0", "")}K`;
  }

  return String(value);
}

export function LiveViewerCount({
  viewers,
}: LiveViewerCountProps) {
  return (
    <View style={styles.container}>
      <Feather
        name="users"
        size={16}
        color="#FFFFFF"
      />

      <Text style={styles.text}>
        {formatCount(viewers)}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
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