// src/components/live/broadcast/header/LiveStats.tsx

import { StyleSheet, View } from "react-native";

import { LiveLikeCount } from "./LiveLikeCount";
import { LiveViewerCount } from "./LiveViewerCount";

type LiveStatsProps = {
  viewers: number;
  likes: number;
};

export function LiveStats({
  viewers,
  likes,
}: LiveStatsProps) {
  return (
    <View style={styles.pill}>
      <LiveViewerCount viewers={viewers} />

      <View style={styles.divider} />

      <LiveLikeCount likes={likes} />
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 19,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,

    backgroundColor: "rgba(20,20,20,0.58)",
  },

  divider: {
    width: 1,
    height: 18,

    backgroundColor: "rgba(255,255,255,0.24)",
  },
});
