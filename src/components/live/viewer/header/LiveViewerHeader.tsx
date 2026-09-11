// src/components/live/viewer/header/LiveViewerHeader.tsx

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

import {
  LiveModeSwitch,
} from "../../shared";

import type {
  ActiveLive,
} from "../../types";

import {
  LiveViewerIdentity,
} from "./LiveViewerIdentity";

type Props = {
  live: ActiveLive;

  viewers: number;
  likes: number;

  followLoading?: boolean;
  isFollowing?: boolean;

  onFollowPress?: () => void;
  onOpenCreator?: () => void;
  onOpenReplays?: () => void;
};

export function LiveViewerHeader({
  live,
  viewers,
  likes,
  followLoading = false,
  isFollowing = false,
  onFollowPress,
  onOpenCreator,
  onOpenReplays,
}: Props) {
  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
    >
      <View
        style={styles.topBar}
        pointerEvents="box-none"
      >
        <LiveModeSwitch
          mode="live"
          onReplayPress={
            onOpenReplays
          }
        />

        <LiveStats
          viewers={viewers}
          likes={likes}
        />
      </View>


    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
    },

    topBar: {
      width: "100%",

      marginBottom: 28,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      paddingHorizontal:
        spacing.md,
    },
  });