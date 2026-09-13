// src/components/now/NowStatusBadge.tsx

import {
  Text,
  View,
} from "react-native";

import {
  nowStatusBadgeStyles as styles,
} from "./NowStatusBadge.styles";

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

