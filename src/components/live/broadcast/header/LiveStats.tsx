// src/components/live/broadcast/header/LiveStats.tsx

import {
  StyleSheet,
  View,
} from "react-native";

import {
  LiveLikeCount,
} from "./LiveLikeCount";

import {
  LiveViewerCount,
} from "./LiveViewerCount";

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
      <LiveViewerCount
        viewers={viewers}
      />

      <View
        style={styles.divider}
      />

      <LiveLikeCount
        likes={likes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 34,

    paddingHorizontal: 11,

    borderRadius: 8,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 9,

    backgroundColor:
      "rgba(0,0,0,0.38)",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.22)",
  },

  divider: {
    width: 1,
    height: 16,

    backgroundColor:
      "rgba(255,255,255,0.28)",
  },
});