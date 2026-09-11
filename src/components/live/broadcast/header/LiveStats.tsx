// src/components/live/broadcast/header/LiveStats.tsx

import {
  StyleSheet,
  View,
} from "react-native";

import {
  Feather,
} from "@expo/vector-icons";

import {
  OverlayPill,
  OverlayPillText,
} from "../../../ui";

import {
  LiveLikeCount,
} from "./LiveLikeCount";

import {
  LiveViewerCount,
} from "./LiveViewerCount";

type LiveStatsProps = {
  viewers?: number;
  views?: number;
  likes?: number;
};

export function LiveStats({
  viewers,
  views,
  likes,
}: LiveStatsProps) {
  const hasViewers =
    typeof viewers === "number";

  const hasViews =
    typeof views === "number";

  const hasLikes =
    typeof likes === "number";

  return (
    <OverlayPill
      style={styles.stats}
    >
      {hasViewers ? (
        <LiveViewerCount
          viewers={viewers}
        />
      ) : null}

      {hasViewers &&
      (hasViews || hasLikes) ? (
        <View
          style={styles.divider}
        />
      ) : null}

      {hasViews ? (
        <View
          style={styles.metric}
        >
          <Feather
            name="play"
            size={15}
            color="#FFFFFF"
          />

          <OverlayPillText>
            {views}
          </OverlayPillText>
        </View>
      ) : null}

      {hasViews && hasLikes ? (
        <View
          style={styles.divider}
        />
      ) : null}

      {hasLikes ? (
        <LiveLikeCount
          likes={likes}
        />
      ) : null}
    </OverlayPill>
  );
}

const styles =
  StyleSheet.create({
    stats: {
      gap: 9,
    },

    metric: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },

    divider: {
      width: 1,
      height: 14,

      backgroundColor:
        "rgba(255,255,255,0.22)",
    },
  });