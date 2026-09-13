// src/components/now/NowAudienceBadge.tsx

import { Ionicons } from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type NowAudienceBadgeProps = {
  type:
    | "live"
    | "replay";

  count?: number | null;
};

export function NowAudienceBadge({
  type,
  count,
}: NowAudienceBadgeProps) {
  return (
    <View
      style={
        styles.badge
      }
    >
      <Ionicons
        name={
          type === "live"
            ? "person"
            : "heart"
        }
        size={12}
        color="#FFFFFF"
      />

      <Text
        style={
          styles.text
        }
      >
        {formatCount(
          count,
        )}
      </Text>
    </View>
  );
}

function formatCount(
  value?: number | null,
) {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    ) ||
    value < 0
  ) {
    return "0";
  }

  if (
    value >=
    1000000
  ) {
    return `${(
      value /
      1000000
    ).toFixed(1)}M`;
  }

  if (
    value >= 1000
  ) {
    return `${(
      value /
      1000
    ).toFixed(1)}K`;
  }

  return String(
    value,
  );
}

const styles =
  StyleSheet.create({
    badge: {
      minHeight: 24,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 4,

      paddingHorizontal:
        8,

      borderRadius:
        999,

      backgroundColor:
        "rgba(10,16,22,0.72)",
    },

    text: {
      color:
        "#FFFFFF",

      fontSize: 11,
      fontWeight:
        "800",
    },
  });