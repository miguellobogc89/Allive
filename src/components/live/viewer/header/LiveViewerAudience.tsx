// src/components/live/viewer/header/LiveViewerAudience.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  LiveAudience,
} from "../../liveAudience";

type Props = {
  audience: LiveAudience;
};

function formatViewerCount(
  value: number,
): string {
  if (value >= 1_000_000) {
    const formatted =
      (value / 1_000_000).toFixed(1);

    return `${formatted.replace(".0", "")}M`;
  }

  if (value >= 1_000) {
    const formatted =
      (value / 1_000).toFixed(1);

    return `${formatted.replace(".0", "")}K`;
  }

  return String(value);
}

export function LiveViewerAudience({
  audience,
}: Props) {
  return (
    <View style={styles.viewerBadge}>
      <Ionicons
        name="people-outline"
        size={18}
        color="#FFFFFF"
      />

      <Text style={styles.viewerText}>
        {formatViewerCount(
          audience.total,
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewerBadge: {
    height: 34,
    minWidth: 78,

    paddingHorizontal: 14,

    borderRadius: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    backgroundColor:
      "rgba(35, 39, 44, 0.92)",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.32,
    shadowRadius: 3,

    elevation: 5,
  },

  viewerText: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "700",

    letterSpacing: -0.2,
  },
});