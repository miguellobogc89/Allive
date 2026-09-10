// src/components/live/replay/header/ReplayHeader.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  spacing,
} from "../../../../styles";

import {
  LiveViewerIdentity,
} from "../../viewer/header/LiveViewerIdentity";

import type {
  Replay,
} from "../types";

import {
  ReplayStatus,
} from "./ReplayStatus";

type ReplayHeaderProps = {
  replay: Replay;
  followLoading?: boolean;
  isFollowing?: boolean;
  onFollowPress?: () => void;
  onOpenCreator?: () => void;
};

export function ReplayHeader({
  replay,
  followLoading = false,
  isFollowing = false,
  onFollowPress,
  onOpenCreator,
}: ReplayHeaderProps) {
  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
    >
      <View
        style={styles.topBar}
        pointerEvents="box-none"
      >
        <View style={styles.replaysBadge}>
          <Ionicons
            name="play-back"
            size={14}
            color="#FFFFFF"
          />
          <Text style={styles.replaysText}>
            Replays
          </Text>
        </View>

        <ReplayStatus
          endedAt={replay.endedAt}
        />
      </View>

      <LiveViewerIdentity
        live={replay}
        followLoading={followLoading}
        isFollowing={isFollowing}
        onFollowPress={onFollowPress}
        onOpenCreator={onOpenCreator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 18,
    left: spacing.md,
    right: spacing.md,
    zIndex: 30,
  },
  topBar: {
    position: "relative",
    width: "100%",
    height: 34,
    marginBottom: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  replaysBadge: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(35,39,44,0.92)",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  replaysText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
