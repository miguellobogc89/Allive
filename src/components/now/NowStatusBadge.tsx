// src/components/now/NowStatusBadge.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type NowStatusBadgeProps = {
  type:
    | "live"
    | "replay";
};

export function NowStatusBadge({
  type,
}: NowStatusBadgeProps) {
  const isLive =
    type === "live";

  return (
    <View
      style={[
        styles.badge,
        isLive
          ? styles.live
          : styles.replay,
      ]}
    >
      <Text
        style={
          styles.text
        }
      >
        {isLive
          ? "LIVE"
          : "REPLAY"}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    badge: {
      minHeight: 24,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        9,

      borderRadius: 7,
    },

    live: {
      backgroundColor:
        "#FF2147",
    },

    replay: {
      backgroundColor:
        "#168CFF",
    },

    text: {
      color:
        "#FFFFFF",

      fontSize: 10,
      fontWeight:
        "900",

      letterSpacing:
        0.5,
    },
  });