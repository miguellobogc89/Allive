// src/components/live/broadcast/header/LiveStats.tsx

import {
  StyleSheet,
  View,
} from "react-native";

import {
  OverlayPill,
} from "../../../ui";

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
    <OverlayPill
      style={styles.stats}
    >
      <LiveViewerCount
        viewers={viewers}
      />

      <View
        style={styles.divider}
      />

      <LiveLikeCount
        likes={likes}
      />
    </OverlayPill>
  );
}

const styles =
  StyleSheet.create({
    stats: {
      gap: 9,
    },

    divider: {
      width: 1,
      height: 14,

      backgroundColor:
        "rgba(255,255,255,0.22)",
    },
  });