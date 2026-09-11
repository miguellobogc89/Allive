// src/components/live/replay/header/ReplayHeader.tsx

import {
  StyleSheet,
  View,
} from "react-native";

import {
  spacing,
} from "../../../../styles";

import {
  LiveStats,
} from "../../broadcast/header/LiveStats";

type ReplayHeaderProps = {
  likes: number;
};

export function ReplayHeader({
  likes,
}: ReplayHeaderProps) {
  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
    >
      <LiveStats
        likes={likes}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 18,
      left: spacing.md,
      right: spacing.md,

      zIndex: 30,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "flex-end",
    },
  });